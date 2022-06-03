const NUMBERS = "0123456789";

export const randomRoomId = () => {
  let res = "";
  for (let i = 0; i < 6; i++) {
    res += NUMBERS[Math.floor(Math.random()*10)]
  }
  return res;
}
