

export function isMonthDifferent(timestamp1: number, timestamp2: number) {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  return date1.getUTCMonth() !== date2.getUTCMonth();
}

export function isDayDifferent(timestamp1: number, timestamp2: number) {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  return date1.getUTCDay() !== date2.getUTCMonth();
}
