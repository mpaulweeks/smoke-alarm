# smoke-alarm

Node package to ping health check endpoints and send alert emails

## usage

```js
import { SmokeAlarm, SmokeAlarmConfig } from '@mpaulweeks/smoke-alarm';

const config: SmokeAlarmConfig = {
  // your config here
};
new SmokeAlarm(config).start();
```
