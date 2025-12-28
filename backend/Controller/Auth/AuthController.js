import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../../Model/index.js";
import { sendEmail } from "../../Config/email.js";
import {
  verificationEmailTemplate,
  welcomeEmailTemplate,
  resetPasswordTemplate,
} from "../../Utils/emailTemplates.js";

// Generate random token
const generateToken = () => crypto.randomBytes(32).toString("hex");

// Register with email verification
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = generateToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      is_verified: false,
      verification_token: verificationToken,
      verification_expires: verificationExpires,
    });

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: "🌾 Verify your AgroFarm account",
      html: verificationEmailTemplate(name, verificationLink),
    });

    res.status(201).json({
      message:
        "Registration successful! Please check your email to verify your account.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: { verification_token: token },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification link" });
    }

    if (user.verification_expires < new Date()) {
      return res.status(400).json({ message: "Verification link has expired" });
    }

    // Update user as verified
    await user.update({
      is_verified: true,
      verification_token: null,
      verification_expires: null,
    });

    // Send welcome email
    await sendEmail({
      to: user.email,
      subject: "🎉 Welcome to AgroFarm!",
      html: welcomeEmailTemplate(user.name),
    });

    res.json({
      message: "Email verified successfully! You can now login.",
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Resend verification email
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate new token
    const verificationToken = generateToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await user.update({
      verification_token: verificationToken,
      verification_expires: verificationExpires,
    });

    // Send email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: "🌾 Verify your AgroFarm account",
      html: verificationEmailTemplate(user.name, verificationLink),
    });

    res.json({ message: "Verification email sent!" });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login (check verification)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if account is active
    if (!user.is_active) {
      return res
        .status(403)
        .json({ message: "Account is deactivated. Contact admin." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email first",
        needsVerification: true,
        email: user.email,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot Password - Send reset email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if email exists for security
      return res.json({ message: "If this email exists, a reset link will be sent." });
    }

    // Generate reset token
    const resetToken = generateToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.update({
      reset_token: resetToken,
      reset_expires: resetExpires,
    });

    // Send reset email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: email,
      subject: "🔐 Reset your AgroFarm password",
      html: resetPasswordTemplate(user.name, resetLink),
    });

    res.json({ message: "If this email exists, a reset link will be sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password - Verify token and update password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ where: { reset_token: token } });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    if (user.reset_expires < new Date()) {
      return res.status(400).json({ message: "Reset link has expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({
      password: hashedPassword,
      reset_token: null,
      reset_expires: null,
    });

    res.json({ message: "Password reset successful! You can now login." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password", "verification_token", "reset_token"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
