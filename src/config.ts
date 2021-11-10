import { SmokeAlarmConfig } from "./lib/types";

const oneMinute = 1000 * 60;

export const config: SmokeAlarmConfig = {
  // default values
  intervalMS: oneMinute * 5,
  positiveIntervalMS: oneMinute * 60,

  // todo fill in with your service
  recipients: [],
  auth: {},
  services: [],
};
