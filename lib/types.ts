
export interface SmokeAlarmResult {
  status: number;
  body: string;
  json: any | null;
}
export type SmokeAlarmVerify = (resp: SmokeAlarmResult) => boolean;
export interface SmokeAlarmEndpoint {
  url: string;
  method?: 'GET' | 'POST';
  verify?: SmokeAlarmVerify;
}
export interface SmokeAlarmService {
  label: string;
  endpoints: SmokeAlarmEndpoint[];
  failuresAllowed?: number;
}
export interface SmokeAlarmConfig {
  intervalMS: number;
  services: SmokeAlarmService[];
  positiveIntervalMS: number;
  recipients: string[];
  auth: SmokeAlarmAuth;
}
export interface SmokeAlarmServiceReport {
  label: string;
  ok: boolean;
}
export interface SmokeAlarmReport {
  created: string; // date
  durationMS: number;
  services: SmokeAlarmServiceReport[];
}

export interface GmailConfig {
  user: string;
  pass: string;
}
export interface AwsSesConfig {
  from: string;
  key: string;
  secret: string;
}
export interface SmokeAlarmAuth {
  awsSes?: AwsSesConfig;
  gmail?: GmailConfig;
}
