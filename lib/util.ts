import { SmokeAlarmVerify } from "./types";

export async function asyncMap<A, B>(arr: A[], mapFunc: ((elm: A) => Promise<B>)) {
  const out = [] as B[];
  for (const elm of arr) {
    const val = await mapFunc(elm);
    out.push(val);
  }
  return out;
}

export const defaultVerify: SmokeAlarmVerify = (resp) => {
  return resp.status < 400;
}
