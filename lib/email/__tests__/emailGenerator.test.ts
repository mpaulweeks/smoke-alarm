import { SmokeAlarmReport, SmokeAlarmServiceReport } from "../../types";
import { EmailGenerator } from "../emailGenerator";

describe('EmailGenerator', () => {
  const sut = new EmailGenerator();

  test('generateRow', () => {
    const service: SmokeAlarmServiceReport = {
      label: 'foo',
      ok: true,
      ping: 999,
      messages: [],
    };
    const expected = `ok   / 999 / foo`;
    expect(sut.generateReportRow(service, 3, 10)).toBe(expected);
  });

  test('generateTable', () => {
    const report: SmokeAlarmReport = {
      created: new Date().toISOString(),
      durationMS: 0,
      services: [{
        label: 'foo',
        ok: true,
        ping: 80,
        messages: ['foo is out of date'],
      }, {
        label: 'barbaz',
        ok: false,
        ping: 999,
        messages: [],
      }],
    };
    const expected = `
ok   /  80 / foo    / foo is out of date
DOWN / 999 / barbaz
    `.trim();
    expect(sut.generateReportTable(report)).toBe(expected);
  });
});
