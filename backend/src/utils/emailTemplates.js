// Welcome & Verification Email
export const verificationEmailTemplate = (name, verificationLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
        .header { background: #166534; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .button { display: inline-block; background: #166534; color: white; padding: 14px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
        .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌾 Welcome to AgroFarm!</h1>
        </div>
        <div class="content">
          <h2>Hello ${name}! 👋</h2>
          <p>Thank you for registering with AgroFarm. We're excited to have you on board!</p>
          <p>Please verify your email address by clicking the button below:</p>
          <center>
            <a href="${verificationLink}" class="button">✓ Verify My Email</a>
          </center>
          <p>This link will expire in <strong>24 hours</strong>.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <br>
          <p>Happy Farming! 🌱</p>
          <p><strong>The AgroFarm Team</strong></p>
        </div>
        <div class="footer">
          <p>© 2025 AgroFarm. All rights reserved.</p>
          <p>Fresh from farm to your doorstep 🚜</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Password Reset Email
export const resetPasswordTemplate = (name, resetLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
        .header { background: #dc2626; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 14px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
        .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello ${name}!</h2>
          <p>We received a request to reset your password for your AgroFarm account.</p>
          <center>
            <a href="${resetLink}" class="button">🔑 Reset My Password</a>
          </center>
          <p>This link will expire in <strong>1 hour</strong>.</p>
          <div class="warning">
            <strong>⚠️ Didn't request this?</strong><br>
            If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
          </div>
          <p><strong>The AgroFarm Team</strong></p>
        </div>
        <div class="footer">
          <p>© 2025 AgroFarm. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Welcome Email (after verification)
export const welcomeEmailTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
        .header { background: #166534; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .feature { display: flex; align-items: center; margin: 15px 0; }
        .emoji { font-size: 30px; margin-right: 15px; }
        .button { display: inline-block; background: #f97316; color: white; padding: 14px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; }
        .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Email Verified!</h1>
        </div>
        <div class="content">
          <h2>Congratulations ${name}!</h2>
          <p>Your email has been verified successfully. You now have full access to AgroFarm!</p>
          
          <h3>What you can do now:</h3>
          <div class="feature"><span class="emoji">🥬</span> Browse fresh farm products</div>
          <div class="feature"><span class="emoji">🐄</span> Explore farm animals</div>
          <div class="feature"><span class="emoji">📅</span> Book daily/weekly/monthly deliveries</div>
          <div class="feature"><span class="emoji">⭐</span> Write reviews for products</div>
          
          <center>
            <a href="${process.env.FRONTEND_URL}" class="button">🛒 Start Shopping</a>
          </center>
          
          <p>Happy Farming! 🌾</p>
        </div>
        <div class="footer">
          <p>© 2025 AgroFarm. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};