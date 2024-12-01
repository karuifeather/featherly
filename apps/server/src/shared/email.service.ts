import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import { htmlToText } from 'html-to-text';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class EmailService {
  private to: string;
  private firstName: string;
  private lastName: string;
  private url: string;
  private from: string;

  constructor(private configService: ConfigService) {}

  // Set up transport using Amazon SES
  private getTransport() {
    const isLocal = process.env.NODE_ENV === 'development';

    const ses = new AWS.SES({
      ...(isLocal && {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
        region: 'us-east-1',
      }),
    });

    return nodemailer.createTransport({
      SES: { ses, aws: AWS },
    });
  }

  // Initialize email metadata
  public initializeEmail(user: { email: string; name: string }, url?: string) {
    this.to = user.email;
    const nameParts = user.name.split(' ');
    this.firstName = nameParts[0];
    this.lastName = nameParts[1] || '';
    this.url = url || ''; // Optional URL
    this.from = this.configService.get('EMAIL_FROM') || 'no-reply@example.com';
  }

  // Render template and send email
  private async send(
    template: string,
    subject: string,
    data: Record<string, any> = {},
    layout = 'layout'
  ) {
    try {
      // 1. Define paths for layout and template
      const templatePath = join(
        __dirname,
        'views',
        'emails',
        `${template}.ejs`
      );
      // /dist/apps/server/src/shared/views/emails/welcome.ejs
      const layoutPath = join(__dirname, 'views', 'emails', `${layout}.ejs`);

      // 2. Render the main email content
      const content = await ejs.renderFile(templatePath, {
        firstName: this.firstName,
        lastName: this.lastName,
        url: this.url,
        subject,
        ...data,
      });

      // 3. Embed the content in the layout
      const html = await ejs.renderFile(layoutPath, {
        subject,
        content, // Pass the rendered content to the layout
        ...data,
      });

      // 4. Define mail options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html),
      };

      // 5. Send the email
      const transport = this.getTransport();
      await transport.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error.message);
      throw new Error('Email sending failed');
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user: { email: string; name: string }, url: string) {
    this.initializeEmail(user, url);
    await this.send('welcome', 'Welcome to Featherly!', {
      type: 'promo',
      unsubscribeUrl: 'https://featherly.karuifeather.com/unsubscribe',
    });
  }

  // Send password reset email
  async sendResetTokenEmail(
    user: { email: string; name: string },
    url: string
  ) {
    this.initializeEmail(user, url);
    await this.send('passwordReset', 'Reset password instructions', {
      type: 'security',
    });
  }

  // Send confirmation email
  async sendConfirmEmail(user: { email: string; name: string }, url: string) {
    this.initializeEmail(user, url);
    await this.send('confirmEmail', 'Confirm your account', {
      type: 'security',
    });
  }
}
