import fetch from 'cross-fetch';
import {
  SmokeAlarmEndpoint,
  SmokeAlarmReport,
  SmokeAlarmResult as SmokeAlarmResponse,
  SmokeAlarmService,
  SmokeAlarmServiceReport,
} from './types';
import { asyncMap, defaultVerify } from './util';

export class SmokeAlarmReporter {
  async generateReport(
    services: SmokeAlarmService[],
  ): Promise<SmokeAlarmReport> {
    const start = new Date();

    const results = await asyncMap(services, async (serv) => {
      const result = await this.verifyService(serv);
      return result;
    });

    const report: SmokeAlarmReport = {
      createdISO: start.toISOString(),
      durationMS: new Date().getTime() - start.getTime(),
      services: results,
    };
    return report;
  }

  private async verifyService(
    service: SmokeAlarmService,
  ): Promise<SmokeAlarmServiceReport> {
    const { endpoints } = service;
    const results = await asyncMap(endpoints, async (ep) => {
      const response = await this.ping(ep);
      const verification = (ep.verify ?? defaultVerify)(response);
      return {
        response,
        verification,
      };
    });
    const failures = results.filter((res) => !res.verification.ok);
    const serviceOK = failures.length <= (service.failuresAllowed ?? 0);
    return {
      label: service.label,
      ok: serviceOK,
      ping: results.length
        ? Math.max(...results.map((res) => res.response.ping))
        : 0,
      messages: results
        .map((res) => res.verification.message)
        .filter((str) => !!str),
    };
  }

  private async ping(
    endpoint: SmokeAlarmEndpoint,
  ): Promise<SmokeAlarmResponse> {
    const result: SmokeAlarmResponse = {
      ping: 0,
      status: 500,
      body: '',
      json: null,
    };
    try {
      const start = new Date().getTime();
      const resp = await fetch(endpoint.url, {
        method: endpoint.method ?? 'GET',
      });
      result.ping = new Date().getTime() - start;
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
