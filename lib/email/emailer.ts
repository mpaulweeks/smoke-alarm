import { AwsSesConfig, GmailConfig, SmokeAlarmReport } from '../types';
import { asyncMap } from '../util';
import { AwsSes } from './awsSes';
import { EmailService } from './emailTypes';
import { Gmail } from './gmail';

export class Emailer {
  private readonly service: EmailService;
  constructor(
    private readonly awsSes: AwsSesConfig | undefined,
    private readonly gmail: GmailConfig | undefined,
  ) {
    if (!awsSes && !gmail) {
      throw new Error('need to provide valid emailer config');
    }
    this.service = (
      (awsSes && new AwsSes(awsSes)) ||
      (gmail && new Gmail(gmail))
    );
  }

  private genHTML(report: SmokeAlarmReport) {
    return `
<p style="font-size: 2em;">
  <b>Smoke Alarm Report</b>
</p>
<p style="font-size: 1em;">
  Took ${report.durationMS} ms
</p>
`.trim();
  }

  async sendReport(recipients: string[], report: SmokeAlarmReport): Promise<void> {
    const body = this.genHTML(report);
    await asyncMap(recipients, async (to) => {
      await this.service.send({
        to,
        subject: 'Smoke Alarm Report',
        body,
      });
    });
  }
}
