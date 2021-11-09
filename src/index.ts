import { SmokeAlarm } from "../lib/smokeAlarm";
import { config } from "./config";

new SmokeAlarm(config).start();
