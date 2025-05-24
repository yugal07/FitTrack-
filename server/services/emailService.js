// Email Service - Gmail Configuration
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      if (process.env.EMAIL_SERVICE === 'gmail') {
        // Gmail configuration
        if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
          throw new Error(
            'Gmail credentials not provided. Please set EMAIL_FROM and EMAIL_PASSWORD environment variables.'
          );
        }

        console.log('🔧 Setting up Gmail transporter...');
        console.log('📧 Email From:', process.env.EMAIL_FROM);

        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASSWORD, // This should be your App Password
          },
          // Additional Gmail-specific settings
          pool: true,
          maxConnections: 5,
          maxMessages: 10,
          rateDelta: 1000,
          rateLimit: 5,
        });

        // Verify the connection
        await this.transporter.verify();
        console.log('✅ Gmail connection verified successfully!');
      } else if (process.env.NODE_ENV === 'production') {
        // Production email service (SendGrid example)
        this.transporter = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASSWORD,
          },
        });
      } else {
        // Default: Use Ethereal for development testing
        console.log('🔧 Creating Ethereal test account...');
        const testAccount = await nodemailer.createTestAccount();

        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        console.log('✅ Ethereal test account created successfully!');
        console.log(
          '📧 Test emails will be available at: https://ethereal.email'
        );
      }
    } catch (error) {
      console.error(
        '❌ Failed to initialize email transporter:',
        error.message
      );

      if (error.message.includes('Invalid login')) {
        console.error('🚨 Gmail Authentication Error:');
        console.error('1. Make sure you have 2-Factor Authentication enabled');
        console.error(
          '2. Use an App Password, not your regular Gmail password'
        );
        console.error(
          '3. Check your EMAIL_FROM and EMAIL_PASSWORD in .env file'
        );
      }

      // Fallback: create a dummy transporter that logs instead of sending
      console.log('🔄 Falling back to console logging...');
      this.transporter = {
        sendMail: async options => {
          console.log('\n📧 EMAIL WOULD BE SENT (Fallback Mode):');
          console.log('To:', options.to);
          console.log('Subject:', options.subject);
          console.log('From:', options.from);

          // Extract reset URL from HTML if it's a password reset email
          const urlMatch = options.html.match(
            /href="([^"]*reset-password[^"]*)"/
          );
          if (urlMatch) {
            console.log('🔗 Reset URL:', urlMatch[1]);
          }

          return { messageId: 'fallback-' + Date.now() };
        },
      };
    }
  }

  async ensureTransporter() {
    if (!this.transporter) {
      await this.initializeTransporter();
    }
  }

  async sendEmail(options) {
    await this.ensureTransporter();

    const mailOptions = {
      from: `${process.env.FROM_NAME || 'FitTrack Pro'} <${process.env.EMAIL_FROM || 'noreply@fittrackpro.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('\n✅ Email sent successfully!');
      console.log('📧 To:', options.email);
      console.log('📝 Subject:', options.subject);
      console.log('🆔 Message ID:', info.messageId);

      // For Ethereal, show the preview URL
      if (
        process.env.EMAIL_SERVICE !== 'gmail' &&
        process.env.NODE_ENV !== 'production'
      ) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          console.log('📧 Preview URL:', previewUrl);
        }
      }

      return info;
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);

      if (error.code === 'EAUTH') {
        console.error(
          '🚨 Authentication failed - please check your Gmail App Password'
        );
      }

      throw new Error('Email could not be sent: ' + error.message);
    }
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    console.log('\n🔐 PASSWORD RESET REQUEST:');
    console.log('👤 User:', user.firstName, user.lastName);
    console.log('📧 Email:', user.email);
    console.log('🔗 Reset URL:', resetUrl);
    console.log('⏰ Token expires in: 10 minutes');

    const html = this.getPasswordResetTemplate(user, resetUrl);

    const options = {
      email: user.email,
      subject: 'Password Reset Request - FitTrack Pro',
      html,
    };

    await this.sendEmail(options);
  }

  getPasswordResetTemplate(user, resetUrl) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - FitTrack Pro</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #4f46e5;
            margin-bottom: 10px;
          }
          .title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            background-color: #4f46e5;
            color: white !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #4338ca;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
          }
          .warning {
            background-color: #fef3cd;
            border: 1px solid #fbbf24;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            color: #92400e;
          }
          .url-backup {
            background-color: #f3f4f6;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            word-break: break-all;
            font-family: monospace;
            font-size: 14px;
            color: #4f46e5;
          }
          @media (max-width: 600px) {
            body {
              padding: 10px;
            }
            .container {
              padding: 20px;
            }
            .button {
              display: block;
              text-align: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏋️ FitTrack Pro</div>
          </div>
          
          <h1 class="title">Password Reset Request</h1>
          
          <div class="content">
            <p>Hello <strong>${user.firstName}</strong>,</p>
            
            <p>We received a request to reset your password for your FitTrack Pro account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button" style="color: white;">Reset Your Password</a>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <div class="url-backup">${resetUrl}</div>
            
            <div class="warning">
              <strong>⏰ Important:</strong> This password reset link will expire in <strong>10 minutes</strong> for security reasons.
            </div>
            
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            
            <p>For security reasons, please don't share this email with anyone.</p>
          </div>
          
          <div class="footer">
            <p><strong>Best regards,</strong><br>The FitTrack Pro Team</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #9ca3af;">
              This is an automated email. Please don't reply to this message.<br>
              © ${new Date().getFullYear()} FitTrack Pro. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendPasswordResetConfirmation(user) {
    console.log('\n✅ Sending password reset confirmation to:', user.email);

    const html = this.getPasswordResetConfirmationTemplate(user);

    const options = {
      email: user.email,
      subject: '✅ Password Reset Successful - FitTrack Pro',
      html,
    };

    await this.sendEmail(options);
  }

  getPasswordResetConfirmationTemplate(user) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Successful - FitTrack Pro</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #4f46e5;
            margin-bottom: 10px;
          }
          .title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .success-icon {
            font-size: 48px;
            color: #10b981;
            text-align: center;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
          }
          .security-tip {
            background-color: #f0f9ff;
            border: 1px solid #38bdf8;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            color: #0c4a6e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏋️ FitTrack Pro</div>
            <div class="success-icon">✅</div>
          </div>
          
          <h1 class="title">Password Reset Successful</h1>
          
          <div class="content">
            <p>Hello <strong>${user.firstName}</strong>,</p>
            
            <p>Great news! Your password has been successfully reset. You can now log in to your FitTrack Pro account with your new password.</p>
            
            <div class="security-tip">
              <strong>🔒 Security Reminder:</strong> For your account's security, make sure to:
              <ul>
                <li>Use a strong, unique password</li>
                <li>Don't share your password with anyone</li>
                <li>Log out from shared or public devices</li>
                <li>Contact us immediately if you notice any suspicious activity</li>
              </ul>
            </div>
            
            <p>If you didn't make this change or if you have any concerns about your account security, please contact our support team immediately.</p>
            
            <p>Happy training! 💪</p>
          </div>
          
          <div class="footer">
            <p><strong>Best regards,</strong><br>The FitTrack Pro Security Team</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #9ca3af;">
              This is an automated email. Please don't reply to this message.<br>
              © ${new Date().getFullYear()} FitTrack Pro. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
