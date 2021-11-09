import { Emailer } from "./email/emailer";
import { SmokeAlarmAuth, SmokeAlarmReport } from "./types";

export class SmokeAlarmAlerter {
  private latestReport: SmokeAlarmReport | undefined;
  private lastEmailedAt = new Date().getTime();
  private emailer: Emailer;
  constructor(
    private readonly positiveIntervalMS: number,
    private readonly recipients: string[],
    auth: SmokeAlarmAuth,
  ) {
    this.emailer = new Emailer(
      auth.awsSes,
      auth.gmail,
    );
  }

  async submit(report: SmokeAlarmReport) {
    const now = new Date().getTime();

    const shouldSubmit = (
      (this.latestReport === undefined) ||
      (report.services.some(ser => !ser.ok)) ||
      (now - this.lastEmailedAt > this.positiveIntervalMS)
    );
    if (shouldSubmit) {
      await this.emailer.sendReport(this.recipients, report);
      this.lastEmailedAt = now;
    }

    this.latestReport = report;
  }
}
