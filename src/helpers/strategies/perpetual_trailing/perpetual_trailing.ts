import { IPortfolio, IProfitAndLoss, IStrategyInput, IStrategySnapshot, ITick } from "../types";

interface ITrailingStop {
  price: number;
  stop: number;
  distance: number;
}

interface ITrade {
  time: number;
  type: "buy" | "sell";
  price: number;
  bound: number;
}
interface ITradePrepare {
  time: number;
  type: "prepare buy" | "prepare sell";
  stop: number;
  bound: number;
}

interface ITradeUpdate {
  time: number;
  type: "update buy" | "update sell";
  stop: number;
  bound: number;
}

export class PerpetualTrailingStrategy {
  private status: "initial" | "processing" = "initial";
  private input: IStrategyInput;
  private trailing: ITrailingStop | null = null;
  private control: { volatile: number; stable: number };
  private portfolio: { volatile: number; stable: number };
  private trades = 0;
  private fees = 0;
  // tradesHistory: (ITrade | ITradePrepare | ITradeUpdate)[] = [];

  constructor(input: IStrategyInput) {
    this.input = input;
    this.control = {
      volatile: input.initial_portfolio.tokenVolatile.amount,
      stable: input.initial_portfolio.tokenStable.amount,
    };
    this.portfolio = {
      volatile: input.initial_portfolio.tokenVolatile.amount,
      stable: input.initial_portfolio.tokenStable.amount,
    };
  }

  private buy(price: number) {
    const exact = this.portfolio.stable / price;
    const fee = exact * this.input.fee;

    this.portfolio.volatile = exact - fee;
    this.portfolio.stable = 0;
    this.fees += fee;
    this.trades++;
    this.trailing = null;
  }

  private sell(price: number) {
    const exact = this.portfolio.volatile * price;
    const fee = exact * this.input.fee;

    this.portfolio.stable = exact - fee;
    this.portfolio.volatile = 0;
    this.fees += fee;
    this.trades++;
    this.trailing = null;
  }

  private updateTrailingBuy(price: number) {
    if ("percent" in this.input.buy_trailing) {
      this.trailing = {
        price,
        stop: price * (1 + this.input.buy_trailing.percent),
        distance: 0,
      };
    } else {
      this.trailing = {
        price,
        stop: price + this.trailing!.distance,
        distance: this.trailing!.distance,
      };
    }
  }

  private updateTrailingSell(price: number) {
    if ("percent" in this.input.sell_trailing) {
      this.trailing = {
        price,
        stop: price * (1 - this.input.sell_trailing.percent),
        distance: 0,
      };
    } else {
      this.trailing = {
        price,
        stop: price - this.trailing!.distance,
        distance: this.trailing!.distance,
      };
    }
  }

  private processTrailingBuy(tick: ITick) {
    if (tick.high_price >= this.trailing!.stop) {
      // this.tradesHistory.push({
      //   time: tick.open_time,
      //   type: "buy",
      //   price: this.trailing!.stop,
      //   bound: this.trailing!.price,
      // });
      this.buy(this.trailing!.stop);
    } else if (tick.low_price <= this.trailing!.price) {
      this.updateTrailingBuy(tick.low_price);
      // this.tradesHistory.push({
      //   time: tick.open_time,
      //   type: "update buy",
      //   stop: this.trailing!.stop,
      //   bound: this.trailing!.price,
      // });
    }
  }

  private processTrailingSell(tick: ITick) {
    if (tick.low_price <= this.trailing!.stop) {
      // this.tradesHistory.push({
      //   time: tick.open_time,
      //   type: "sell",
      //   price: this.trailing!.stop,
      //   bound: this.trailing!.price,
      // });
      this.sell(this.trailing!.stop);
    } else if (tick.high_price >= this.trailing!.price) {
      this.updateTrailingSell(tick.high_price);
      // this.tradesHistory.push({
      //   time: tick.open_time,
      //   type: "update sell",
      //   stop: this.trailing!.stop,
      //   bound: this.trailing!.price,
      // });
    }
  }

  private processHolderStrategy(tick: ITick) {
    this.control.volatile = this.control.stable / tick.open_price;
    this.control.stable = 0;
  }

  private getSnapshot(tick: ITick) {
    const control: IPortfolio = {
      ...this.control,
      valueInUSD: this.control.volatile * tick.close_price,
    };

    const portfolio: IPortfolio = {
      ...this.portfolio,
      valueInUSD: this.portfolio.volatile ? this.portfolio.volatile * tick.close_price : this.portfolio.stable,
    };

    const pnl: IProfitAndLoss = {
      amount: portfolio.valueInUSD - control.valueInUSD,
      percent: portfolio.valueInUSD / control.valueInUSD - 1,
      duration: tick.open_time - this.input.period.starting_date,
      trades: this.trades,
      fee: this.fees,
    };

    const snapshot: IStrategySnapshot = {
      timestamp: tick.open_time,
      price: tick.open_price,
      control,
      portfolio,
      pnl,
    };

    return snapshot;
  }

  private prepareTrailingBuy(price: number) {
    if ("percent" in this.input.buy_trailing) {
      this.trailing = {
        price,
        stop: price * (1 + this.input.buy_trailing.percent),
        distance: 0,
      };
    } else {
      this.trailing = {
        price,
        stop: price * (1 + this.input.buy_trailing.distance),
        distance: price * this.input.buy_trailing.distance,
      };
    }
  }

  private prepareTrailingSell(price: number) {
    if ("percent" in this.input.sell_trailing) {
      this.trailing = {
        price,
        stop: price * (1 - this.input.sell_trailing.percent),
        distance: 0,
      };
    } else {
      this.trailing = {
        price,
        stop: price * (1 - this.input.sell_trailing.distance),
        distance: price * -this.input.sell_trailing.distance,
      };
    }
  }

  private prepareTrailing(tick: ITick) {
    if (this.portfolio.stable) {
      this.prepareTrailingBuy(tick.open_price);
      // this.tradesHistory.push({
      //   time: tick.open_time,
      //   type: "prepare buy",
      //   stop: this.trailing!.stop,
      //   bound: this.trailing!.price,
      // });
    } else {
      this.prepareTrailingSell(tick.open_price);
      // this.tradesHistory.push({
      //   time: tick.open_time,
      //   type: "prepare sell",
      //   stop: this.trailing!.stop,
      //   bound: this.trailing!.price,
      // });
    }
  }

  feed(tick: ITick) {
    if (this.status === "initial") {
      this.status = "processing";
      this.processHolderStrategy(tick);
    }

    if (!this.trailing) {
      this.prepareTrailing(tick);
    }

    if (this.portfolio.stable) {
      this.processTrailingBuy(tick);
    } else {
      this.processTrailingSell(tick);
    }
    return this.getSnapshot(tick);
  }
}
