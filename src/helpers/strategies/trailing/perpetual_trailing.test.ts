import { format } from "date-fns";
import { IStrategyInput } from "../types";
import { ticksSample } from "./data";
import { PerpetualTrailingStrategy } from "./perpetual_trailing";

const STARTING_DATE = ticksSample[0].open_time;

const defaultInput: IStrategyInput = {
  initial_portfolio: { tokenVolatile: { symbol: "ETH", amount: 0 }, tokenStable: { symbol: "USDT", amount: 100 } },
  buy_trailing: { percent: 0.002 },
  sell_trailing: { percent: 0.002 },
  fee: 0,
  period: { starting_date: STARTING_DATE },
};

describe("PerpetualTrailingStrategy", () => {
  it.only("Multiple trades", () => {
    const strategy = new PerpetualTrailingStrategy(defaultInput);
    const snapshots = ticksSample.map((v) => strategy.feed(v));
    // console.log(
    //   "---------",
    //   "strategy",
    //   strategy.tradesHistory.map((v) => {
    //     const { time, ...others } = v;
    //     return `${format(time, "hh:mm")} ${JSON.stringify(others, null)}`;
    //   })
    // );

    console.log(
      "---------",
      "snapshots",
      snapshots.map((v) => v.portfolio)
    );
    // console.log('---------', 'last snapshots', snapshots[snapshots.length - 1]);

    // expect(snapshots[snapshots.length - 1]).toStrictEqual({
    //   control: { stable: 0, valueInUSD: 99.87612263858782, volatile: 0.07742335088262621 },
    //   pnl: { amount: 0.24615424024644028, duration: 1800000, fee: 0, percent: 0.002464595478312459, trades: 23 },
    //   portfolio: { stable: 0, valueInUSD: 100.12227687883426, volatile: 0.07761416812312733 },
    //   price: 1287.6,
    //   timestamp: 1577838600000,
    // });
  });
});
