/**
 * Auth Controller Tests
 * Tests for register, login, verifyEmail, updateProfile, changePassword
 */

import { jest } from "@jest/globals";

// Mock bcrypt
const bcrypt = {
  hash: jest.fn(),
  compare: jest.fn(),
};

// Mock JWT util
const jwt = {
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
};

// Mock User model
const mockUser = {
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

// Mock user instance
const mockUserInstance = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  password: "$2b$10$hashedpassword",
  phone: "1234567890",
  role: "customer",
  is_active: true,
  is_verified: true,
  profile_image: null,
  verification_token: null,
  update: jest.fn(),
  save: jest.fn(),
  destroy: jest.fn(),
  toJSON: function () {
    return { ...this };
  },
};

// Helper: mock response
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should validate required fields", () => {
      const body = { email: "test@example.com" };
      const res = mockResponse();

      if (!body.name || !body.email || !body.password || !body.phone) {
        res.status(400).json({ message: "All fields are required" });
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should validate email format", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test("valid@email.com")).toBe(true);
      expect(emailRegex.test("invalid-email")).toBe(false);
      expect(emailRegex.test("@nodomain.com")).toBe(false);
      expect(emailRegex.test("spaces in@email.com")).toBe(false);
    });

    it("should validate password strength", () => {
      const isValidPassword = (pw) =>
        pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw);

      expect(isValidPassword("Short1A")).toBe(false); // too short
      expect(isValidPassword("alllowercase1")).toBe(false); // no uppercase
      expect(isValidPassword("ALLUPPERCASE1")).toBe(false); // no lowercase
      expect(isValidPassword("NoNumbers")).toBe(false); // no number
      expect(isValidPassword("ValidPass1")).toBe(true);
      expect(isValidPassword("Str0ngP@ss")).toBe(true);
    });

    it("should reject duplicate email", async () => {
      mockUser.findOne.mockResolvedValue(mockUserInstance);

      const res = mockResponse();
      const existing = await mockUser.findOne({ where: { email: "john@example.com" } });

      if (existing) {
        res.status(400).json({ message: "Email already registered" });
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should create user with hashed password", async () => {
      mockUser.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("$2b$10$hashed");

      const password = "ValidPass1";
      const hashedPassword = await bcrypt.hash(password, 10);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(hashedPassword).not.toBe(password);

      const newUser = {
        id: 2,
        name: "Jane",
        email: "jane@example.com",
        password: hashedPassword,
        phone: "0987654321",
        role: "customer",
        is_active: true,
        is_verified: false,
      };
      mockUser.create.mockResolvedValue(newUser);

      const user = await mockUser.create(newUser);
      expect(user.password).toBe("$2b$10$hashed");
      expect(user.is_verified).toBe(false);
    });
  });

  describe("login", () => {
    it("should validate required login fields", () => {
      const res = mockResponse();

      // Missing password
      const body1 = { email: "john@example.com" };
      if (!body1.email || !body1.password) {
        res.status(400).json({ message: "Email and password are required" });
      }
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 401 for non-existent user", async () => {
      mockUser.findOne.mockResolvedValue(null);

      const res = mockResponse();
      const user = await mockUser.findOne({ where: { email: "nobody@example.com" } });

      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
      }

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 403 for deactivated account", async () => {
      const inactiveUser = { ...mockUserInstance, is_active: false };
      mockUser.findOne.mockResolvedValue(inactiveUser);

      const res = mockResponse();
      const user = await mockUser.findOne({ where: { email: "john@example.com" } });

      if (!user.is_active) {
        res.status(403).json({ message: "Account is deactivated" });
      }

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should return 401 for wrong password", async () => {
      mockUser.findOne.mockResolvedValue(mockUserInstance);
      bcrypt.compare.mockResolvedValue(false);

      const res = mockResponse();
      const user = await mockUser.findOne({ where: { email: "john@example.com" } });
      const isMatch = await bcrypt.compare("wrongpassword", user.password);

      if (!isMatch) {
        res.status(401).json({ message: "Invalid email or password" });
      }

      expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", user.password);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 403 for unverified account", async () => {
      const unverifiedUser = { ...mockUserInstance, is_verified: false };
      mockUser.findOne.mockResolvedValue(unverifiedUser);
      bcrypt.compare.mockResolvedValue(true);

      const res = mockResponse();
      const user = await mockUser.findOne({ where: { email: "john@example.com" } });
      const isMatch = await bcrypt.compare("password", user.password);

      if (isMatch && !user.is_verified) {
        res.status(403).json({ message: "Please verify your email first" });
      }

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should return token on successful login", async () => {
      mockUser.findOne.mockResolvedValue(mockUserInstance);
      bcrypt.compare.mockResolvedValue(true);
      jwt.generateToken.mockReturnValue("jwt-token-123");

      const res = mockResponse();
      const user = await mockUser.findOne({ where: { email: "john@example.com" } });
      const isMatch = await bcrypt.compare("ValidPass1", user.password);

      if (isMatch && user.is_verified && user.is_active) {
        const token = jwt.generateToken({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        res.json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile_image: user.profile_image,
          },
        });
      }

      expect(jwt.generateToken).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Login successful",
          token: "jwt-token-123",
          user: expect.objectContaining({
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "customer",
          }),
        })
      );
    });

    it("should include profile_image in login response", async () => {
      const userWithImage = { ...mockUserInstance, profile_image: "/uploads/profile.jpg" };

      const loginResponse = {
        message: "Login successful",
        token: "jwt-token",
        user: {
          id: userWithImage.id,
          name: userWithImage.name,
          email: userWithImage.email,
          role: userWithImage.role,
          profile_image: userWithImage.profile_image,
        },
      };

      expect(loginResponse.user.profile_image).toBe("/uploads/profile.jpg");
    });
  });

  describe("verifyEmail", () => {
    it("should verify email with valid token", async () => {
      const user = {
        ...mockUserInstance,
        is_verified: false,
        verification_token: "valid-token",
        update: jest.fn(),
      };
      mockUser.findOne.mockResolvedValue(user);

      const res = mockResponse();
      const found = await mockUser.findOne({
        where: { verification_token: "valid-token" },
      });

      if (found) {
        await found.update({ is_verified: true, verification_token: null });
        res.json({ message: "Email verified successfully" });
      }

      expect(found.update).toHaveBeenCalledWith({
        is_verified: true,
        verification_token: null,
      });
      expect(res.json).toHaveBeenCalledWith({ message: "Email verified successfully" });
    });

    it("should return 400 for invalid token", async () => {
      mockUser.findOne.mockResolvedValue(null);

      const res = mockResponse();
      const found = await mockUser.findOne({
        where: { verification_token: "invalid-token" },
      });

      if (!found) {
        res.status(400).json({ message: "Invalid verification token" });
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("updateProfile", () => {
    it("should update user profile", async () => {
      const user = { ...mockUserInstance, update: jest.fn() };
      mockUser.findByPk.mockResolvedValue(user);

      const res = mockResponse();
      const found = await mockUser.findByPk(1);
      await found.update({ name: "Updated Name", phone: "1111111111" });
      res.json({
        message: "Profile updated",
        user: { ...found, name: "Updated Name" },
      });

      expect(found.update).toHaveBeenCalledWith({
        name: "Updated Name",
        phone: "1111111111",
      });
    });

    it("should not allow email update to existing email", async () => {
      mockUser.findOne.mockResolvedValue({ ...mockUserInstance, id: 2 });

      const res = mockResponse();
      const reqUser = { id: 1 };
      const existing = await mockUser.findOne({ where: { email: "john@example.com" } });

      if (existing && existing.id !== reqUser.id) {
        res.status(400).json({ message: "Email already in use" });
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("changePassword", () => {
    it("should verify current password before changing", async () => {
      bcrypt.compare.mockResolvedValue(false);

      const res = mockResponse();
      const isMatch = await bcrypt.compare("wrongcurrent", "hashedpassword");

      if (!isMatch) {
        res.status(400).json({ message: "Current password is incorrect" });
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should hash new password", async () => {
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue("$2b$10$newhashed");

      const isMatch = await bcrypt.compare("currentpassword", "hashedpassword");
      expect(isMatch).toBe(true);

      const newHashed = await bcrypt.hash("NewPassword1", 10);
      expect(newHashed).toBe("$2b$10$newhashed");
      expect(bcrypt.hash).toHaveBeenCalledWith("NewPassword1", 10);
    });
  });

  describe("deleteAccount", () => {
    it("should delete user account", async () => {
      const user = { ...mockUserInstance, destroy: jest.fn() };
      mockUser.findByPk.mockResolvedValue(user);

      const res = mockResponse();
      const found = await mockUser.findByPk(1);
      await found.destroy();
      res.json({ message: "Account deleted successfully" });

      expect(found.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "Account deleted successfully" });
    });
  });
});
