import { SmokeAlarmAlerter } from "./alerter";
import { SmokeAlarmReporter } from "./report";
import { SmokeAlarmConfig } from "./types";

export class SmokeAlarm {
  private reporter = new SmokeAlarmReporter();
  private alerter: SmokeAlarmAlerter;
  private timeout: NodeJS.Timeout | undefined;
  constructor(
    private readonly config: SmokeAlarmConfig,
  ) {
    this.alerter = new SmokeAlarmAlerter(
      config.positiveIntervalMS,
      config.recipients,
      config.auth,
    );
  }

  start() {
    this.loop();
  }
  stop() {
    clearTimeout(this.timeout);
  }

  private async loop() {
    clearTimeout(this.timeout);
    await this.step();
    this.timeout = setTimeout(() => this.loop(), this.config.intervalMS);
  }

  private async step() {
    const report = await this.reporter.generateReport(this.config.services);
    await this.alerter.submit(report);
  }
}
