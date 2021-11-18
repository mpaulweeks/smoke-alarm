import { SmokeAlarmServiceReport } from '../../types';
import { EmailGenerator } from '../emailGenerator';

describe('EmailGenerator', () => {
  const sut = new EmailGenerator();

  test('generateRow', () => {
    const service: SmokeAlarmServiceReport = {
      label: 'foo',
      ok: true,
      ping: 999,
      status: '???',
      messages: [],
    };
    const expected = `??? 999ms foo`;
    expect(sut.generateReportRow(service, 3, 10)).toBe(expected);
  });

  test('generateTable', () => {
    const services: SmokeAlarmServiceReport[] = [
      {
        label: 'foo',
        ok: true,
        ping: 80,
        status: 200,
        messages: ['foo is out of date'],
      },
      {
        label: 'barbaz',
        ok: false,
        ping: 999,
        status: 500,
        messages: [],
      },
    ];
    const expected = `
200  80ms foo    / foo is out of date
500 999ms barbaz
    `.trim();
    expect(sut.generateReportTable(services).join('\n')).toBe(expected);
  });
});
