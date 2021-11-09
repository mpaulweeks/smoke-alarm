import { SmokeAlarmEndpoint, SmokeAlarmReport, SmokeAlarmResult, SmokeAlarmService, SmokeAlarmServiceReport } from "./types";
import { asyncMap, defaultVerify } from "./util";

export class SmokeAlarmReporter {

  async generateReport(services: SmokeAlarmService[]): Promise<SmokeAlarmReport> {
    const start = new Date();

    const results = await asyncMap(services, async (serv) => {
      const result = await this.verifyService(serv);
      return result;
    });

    const report: SmokeAlarmReport = {
      created: start.toISOString(),
      durationMS: new Date().getTime() - start.getTime(),
      services: results,
    }
    return report;
  }

  private async verifyService(service: SmokeAlarmService): Promise<SmokeAlarmServiceReport> {
    const { endpoints } = service;
    const results = await asyncMap(endpoints, async (ep) => {
      const result = await this.ping(ep);
      const ok = (ep.verify ?? defaultVerify)(result);
      return ok;
    });
    const failures = results.filter(ok => !ok);
    const serviceOK = failures.length <= (service.failuresAllowed ?? 0);
    return {
      label: service.label,
      ok: serviceOK,
    };
  }

  private async ping(endpoint: SmokeAlarmEndpoint): Promise<SmokeAlarmResult> {
    const result: SmokeAlarmResult = {
      status: 500,
      body: '',
      json: null,
    };
    try {
      const resp = await fetch(endpoint.url, {
        method: endpoint.method ?? 'GET',
      });
      result.status = resp.status;
      const body = await resp.text();
      result.body = body;
      result.json = JSON.parse(body);
    } catch (err) {
      // do nothing, return default values
    }
    return result;
  }
}
