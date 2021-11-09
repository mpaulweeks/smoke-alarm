import fs from 'fs';
import { SmokeAlarmConfig } from "../lib/types";

const oneMinute = 1000 * 60;

const auth: { awsKey: string, awsSecret: string } = JSON.parse(fs.readFileSync('auth.json').toString());

export const config: SmokeAlarmConfig = {
  // default values
  intervalMS: oneMinute * 5,
  positiveIntervalMS: oneMinute * 60,

  // todo fill in with your service
  recipients: [
    'toughlovearena@gmail.com',
  ],
  auth: {
    awsSes: {
      from: 'toughlovearena.login@gmail.com',
      key: auth.awsKey,
      secret: auth.awsSecret,
    },
  },
  services: [{
    label: 'toughlovearena.com',
    endpoints: [{
      url: 'https://toughlovearena.com/version.json',
    }],
  }, {
    label: 'presence.tla',
    endpoints: [{
      url: 'https://presence.toughlovearena.com/health',
    }],
  }],
};
