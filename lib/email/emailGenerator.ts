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
  generateReportTable(report: SmokeAlarmReport): string {
    const maxPingSize = (
      report.services.length
        ? Math.max(...report.services.map(ser => ser.ping.toString().length))
        : 0
    );
    const maxLabelSize = (
      report.services.length
        ? Math.max(...report.services.map(ser => ser.label.length))
        : 0
    );
    const rows = report.services.map(serv => this.generateReportRow(serv, maxPingSize, maxLabelSize));
    return rows.join('\n');
  }
}
