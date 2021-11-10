import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { GmailConfig } from '../types';
import { EmailArgs, EmailService } from './emailTypes';

export class Gmail implements EmailService {
  private readonly gmailTransporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  constructor(private readonly config: GmailConfig) {
    this.gmailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.user,
        pass: config.pass,
      }
    });
  }

  async send(args: EmailArgs) {
    const options: Mail.Options = {
      from: this.config.user,
      to: args.to,
      subject: args.subject,
      html: args.body,
    };
    const result = await this.gmailTransporter.sendMail(options);
    // tslint:disable-next-line: no-console
    // console.log('gmail:', result);
  }
}
