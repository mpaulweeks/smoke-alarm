import { AwsSesConfig, GmailConfig, SmokeAlarmReport } from '../types';
import { asyncMap } from '../util';
import { AwsSes } from './awsSes';
import { EmailGenerator } from './emailGenerator';
import { EmailService } from './emailTypes';
import { Gmail } from './gmail';

export class Emailer {
  private readonly generator = new EmailGenerator();
  private readonly service: EmailService;
  constructor(
    awsSes: AwsSesConfig | undefined,
    gmail: GmailConfig | undefined,
  ) {
    if (!awsSes && !gmail) {
      throw new Error('need to provide valid emailer config');
    }
    this.service = (
      (awsSes && new AwsSes(awsSes)) ||
      (gmail && new Gmail(gmail))
    );
  }

  async sendReport(recipients: string[], report: SmokeAlarmReport): Promise<void> {
    const body = this.generator.generateEmail(report);
    await asyncMap(recipients, async (to) => {
      await this.service.send({
        to,
        subject: 'Smoke Alarm Report',
        body,
      });
    });
  }
}
