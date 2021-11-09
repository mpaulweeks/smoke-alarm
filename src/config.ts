import fs from 'fs';
import { SmokeAlarmConfig, SmokeAlarmVerify } from "../lib/types";

const oneMinute = 1000 * 60;

const auth: { awsKey: string, awsSecret: string } = JSON.parse(fs.readFileSync('auth.json').toString());
const verifyJson: SmokeAlarmVerify = resp => ({
  ok: !!resp.json,
});

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
      verify: resp => ({
        ok: !!resp.json,
        message: resp.json?.v,
      }),
    }],
  }, {
    label: 'cache.tla',
    endpoints: [{
      url: 'https://cache.toughlovearena.com/health',
      verify: verifyJson,
    }],
  }, {
    label: 'handshake.tla',
    endpoints: [{
      url: 'https://handshake.toughlovearena.com/health',
      verify: verifyJson,
    }],
  }, {
    label: 'leaderboard.tla',
    endpoints: [{
      url: 'https://leaderboard.toughlovearena.com/health',
      verify: verifyJson,
    }],
  }, {
    label: 'match.tla',
    endpoints: [{
      url: 'https://match.toughlovearena.com',
      verify: verifyJson,
    }],
  }, {
    label: 'presence.tla',
    endpoints: [{
      url: 'https://presence.toughlovearena.com/health',
      verify: verifyJson,
    }],
  }, {
    label: 'lobbya.tla',
    endpoints: [{
      url: 'https://lobbya.toughlovearena.com/health',
      verify: verifyJson,
    }],
  }, {
    label: 'lobbyb.tla',
    endpoints: [{
      url: 'https://lobbyb.toughlovearena.com/health',
      verify: verifyJson,
    }],
  }, {
    label: 'stun.tla',
    endpoints: [{
      url: 'https://stun.toughlovearena.com/health',
    }],
  }, {
    label: 'serverless accounts API	',
    endpoints: [{
      url: 'https://us-central1-fighter-api.cloudfunctions.net/webApi/api/v1/',
      verify: verifyJson,
    }],
  }],
};
