import { SmokeAlarmReport, SmokeAlarmServiceReport } from '../types';

export class EmailGenerator {

  generateReportRow(service: SmokeAlarmServiceReport, pingLen: number, labelLen: number): string {
    const status = (service.ok ? 'ok' : 'DOWN').padEnd(4, ' ');
    const ping = service.ping.toString().padStart(pingLen, ' ');
    const label = service.label.padEnd(labelLen, ' ');
    let row = `${status} / ${ping} / ${label}`;
    if (service.messages.length) {
      const messages = service.messages.join(', ');
      row += ` / ${messages}`;
    }
    return row.trim();
  }
  generateReportTable(services: SmokeAlarmServiceReport[]): string[] {
    const maxPingSize = (
      services.length
        ? Math.max(...services.map(ser => ser.ping.toString().length))
        : 0
    );
    const maxLabelSize = (
      services.length
        ? Math.max(...services.map(ser => ser.label.length))
        : 0
    );
    const rows = services.map(serv => this.generateReportRow(serv, maxPingSize, maxLabelSize));
    return rows;
  }

  generateEmail(report: SmokeAlarmReport): string {
    return `
<div style="font-size: 1.5em;">
  <b>Smoke Alarm Report</b>
</div>
<div>
  Ran at ${report.created}
</div>
<div>
  Took ${report.durationMS} ms
</div>
<div style="font: 'monospace';">
    ${this.generateReportTable(report.services).map(row => `<div>${row}</div>`)}
</div>
`.trim();
  }
}
