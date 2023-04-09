import { IStrategyInput } from "../types";
import { ticksSample } from "./data";
import { TrailingStrategy } from "./trailing_strategy";

const STARTING_DATE = ticksSample[0].open_time;

const defaultInput: IStrategyInput = {
  initial_portfolio: { tokenVolatile: { symbol: "ETH", amount: 0 }, tokenStable: { symbol: "USDT", amount: 1000 } },
  trailingPercent: 0.001,
  fee: 0.0001,
  period: { starting_date: STARTING_DATE },
};

describe("TrailingStrategy", () => {
  it("Multiple trades", () => {
    const strategy = new TrailingStrategy(defaultInput);
    const snapshots = ticksSample.map((v) => strategy.feed(v));

    snapshots.map(TrailingStrategy.debugSnapshot);
  });
});
