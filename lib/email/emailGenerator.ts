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

  generateEmail(report: SmokeAlarmReport): { subject: string, body: string } {
    const utcTime = new Date(report.createdISO);
    const estDate = utcTime.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
    const estTime = utcTime.toLocaleString('en-US', {
      timeZone: 'America/New_York',
    });
    const tableHtml = this.generateReportTable(report.services).map(row => `<div>${row}</div>`).join('');
    const isDown = report.services.some(ser => !ser.ok);
    const subject = `Smoke Alarm ${estDate} ${isDown ? 'DOWN' : 'ok'}`;
    const body = `
<div style="font-size: 1.5em;">
  <b>Smoke Alarm Report</b>
</div>
<br/>
<div>
  Ran at ${estTime}
</div>
<div>
  Took ${report.durationMS} ms
</div>
<pre>
${tableHtml}
</pre>
`.trim();
    return { subject, body };
  }
}
