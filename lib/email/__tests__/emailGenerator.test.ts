import { SmokeAlarmServiceReport } from "../../types";
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
    const expected = `ok   999 / foo`;
    expect(sut.generateReportRow(service, 3, 10)).toBe(expected);
  })
});
