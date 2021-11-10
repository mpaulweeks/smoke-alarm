import { Updater } from '@toughlovearena/updater';
import { config } from "./config";
import { SmokeAlarm } from "./lib/smokeAlarm";

(async () => {
  new Updater().cron();
  new SmokeAlarm(config).start();
})();
