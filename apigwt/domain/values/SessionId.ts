import { NUMBERS } from "./RoomId";

const ALPHANUMS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + NUMBERS;
const ALPHANUMS_LEN = ALPHANUMS.length;

export const randomSessionId = () => {
  let res = "";
  for (let i = 0; i < 16; i++) {
    res += ALPHANUMS[Math.floor(Math.random()*ALPHANUMS_LEN)]
  }
  console.log('newSessionId:', res);
  return res;
}
