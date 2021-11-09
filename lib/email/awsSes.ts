import ses from 'node-ses';
import { AwsSesConfig } from '../types';
import { EmailArgs, EmailService } from './emailTypes';

export class AwsSes implements EmailService {
  private readonly sesClient: ses.Client;
  constructor(private readonly config: AwsSesConfig) {
    this.sesClient = ses.createClient({
      key: config.key,
      secret: config.secret,
    });
  }

  async send(args: EmailArgs) {
    return new Promise<void>((resolve, reject) => {
      this.sesClient.sendEmail({
        to: args.to,
        from: this.config.from,
        subject: args.subject,
        message: args.body,
      }, (err, data, res) => {
        if (err) {
          // tslint:disable-next-line: no-console
          console.log('ses err:', err);
          reject(err);
        } else {
          // tslint:disable-next-line: no-console
          console.log('ses:', data, res);
          resolve();
        }
      });
    });
  }
}
