import { addMinutes } from "date-fns";
import { IStrategyInput, ITick } from "../types";
import { PerpetualTrailingStrategy } from "./perpetual_trailing";

const STARTING_DATE = 1675209600000;

const defaultInput: IStrategyInput = {
  initial_portfolio: { tokenVolatile: { symbol: "ETH", amount: 0 }, tokenStable: { symbol: "USDT", amount: 100 } },
  buy_trailing: { percent: 0.02 },
  sell_trailing: { percent: 0.02 },
  fee: { percent: 0 },
  period: { starting_date: STARTING_DATE },
};

const ticks: ITick[] = [
  { open_time: addMinutes(STARTING_DATE, 0).getTime(), open_price: 100 },
  { open_time: addMinutes(STARTING_DATE, 1).getTime(), open_price: 97 },
  { open_time: addMinutes(STARTING_DATE, 2).getTime(), open_price: 105 },
  { open_time: addMinutes(STARTING_DATE, 3).getTime(), open_price: 110 },
  { open_time: addMinutes(STARTING_DATE, 4).getTime(), open_price: 115 },
  { open_time: addMinutes(STARTING_DATE, 5).getTime(), open_price: 120 },
  { open_time: addMinutes(STARTING_DATE, 6).getTime(), open_price: 115 },
  { open_time: addMinutes(STARTING_DATE, 7).getTime(), open_price: 100 },
];

describe("PerpetualTrailing", () => {
  it("Default", () => {
    const strategy = new PerpetualTrailingStrategy(defaultInput);
    let snapshot = strategy.feed(ticks[0]);
    expect(snapshot).toStrictEqual({
      control: { stable: 0, valueInUSD: 100, volatile: 1 },
      pnl: { amount: 0, duration: 0, fee: 0, percent: 0, trades: 0 },
      portfolio: { stable: 100, valueInUSD: 100, volatile: 0 },
      price: 100,
      timestamp: 1675209600000,
    });
    snapshot = strategy.feed(ticks[1]);
    expect(snapshot).toStrictEqual({
      control: { stable: 0, valueInUSD: 97, volatile: 1 },
      pnl: { amount: 3, duration: 60000, fee: 0, percent: 0.030927835051546282, trades: 0 },
      portfolio: { stable: 100, valueInUSD: 100, volatile: 0 },
      price: 97,
      timestamp: 1675209660000,
    });
    snapshot = strategy.feed(ticks[2]);
    expect(snapshot).toStrictEqual({
      control: { stable: 0, valueInUSD: 105, volatile: 1 },
      pnl: { amount: 1.1249241964827092, duration: 120000, fee: 0, percent: 0.010713563776025836, trades: 1 },
      portfolio: { stable: 0, valueInUSD: 106.12492419648271, volatile: 1.0107135637760258 },
      price: 105,
      timestamp: 1675209720000,
    });
  });

  it("Multiple trades", () => {
    const strategy = new PerpetualTrailingStrategy(defaultInput);
    const snapshots = ticks.map((v) => strategy.feed(v));
    expect(snapshots[snapshots.length - 1]).toStrictEqual({
      control: { stable: 0, valueInUSD: 100, volatile: 1 },
      pnl: { amount: 18.859915100060633, duration: 420000, fee: 0, percent: 0.18859915100060642, trades: 2 },
      portfolio: { stable: 118.85991510006063, valueInUSD: 118.85991510006063, volatile: 0 },
      price: 100,
      timestamp: 1675210020000,
    });
  });
});
