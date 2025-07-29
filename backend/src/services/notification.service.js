// backend/src/services/notification.service.js
const nodemailer = require('nodemailer');
const { Customer, Employee, Business } = require('../models');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendCheckInConfirmation(customer, business) {
    if (!customer.email) return;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: customer.email,
      subject: `Check-in Confirmation - ${business.name}`,
      html: `
        <div style="font-family: ${business.fontFamily || 'Arial'}, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: ${business.primaryColor || '#4F46E5'}; color: white; padding: 20px; text-align: center;">
            <h1>${business.name}</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Thank you for checking in!</h2>
            <p>Hi ${customer.name},</p>
            <p>Your queue number is: <strong style="font-size: 24px; color: ${business.primaryColor || '#4F46E5'};">#${customer.queueNumber}</strong></p>
            <p>We'll notify you when your service provider is ready to see you.</p>
            ${customer.reason ? `<p>Reason for visit: ${customer.reason}</p>` : ''}
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email send error:', error);
    }
  }

  async sendReadyNotification(customer, employee, business) {
    if (!customer.email) return;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: customer.email,
      subject: `Ready for You - ${business.name}`,
      html: `
        <div style="font-family: ${business.fontFamily || 'Arial'}, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: ${business.primaryColor || '#4F46E5'}; color: white; padding: 20px; text-align: center;">
            <h1>${business.name}</h1>
          </div>
          <div style="padding: 20px;">
            <h2>${employee.name} is ready to see you!</h2>
            <p>Hi ${customer.name},</p>
            <p>Your service provider is ready to begin. Please proceed to the service area.</p>
            <p>Queue number: <strong>#${customer.queueNumber}</strong></p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email send error:', error);
    }
  }
}

module.exports = new NotificationService();
