import { IPortfolio, IProfitAndLoss, IStrategyInput, IStrategySnapshot, ITick } from "../types";

interface ITrailingStop {
  price: number;
  stop: number;
  distance: number;
}

export class PerpetualTrailingStrategy {
  private status: "initial" | "processing" = "initial";
  private input: IStrategyInput;
  private trailing: ITrailingStop = { price: 0, stop: 0, distance: 0 };
  private control: { volatile: number; stable: number };
  private portfolio: { volatile: number; stable: number };
  private trades = 0;
  private fee = 0;
  private bounds: number[] = [];

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
    this.portfolio.volatile = this.portfolio.stable / price;
    this.portfolio.stable = 0;
    this.trades++;
  }

  private sell(price: number) {
    this.portfolio.stable = this.portfolio.volatile * price;
    this.portfolio.volatile = 0;
    this.trades++;
  }

  private updateTrailingBuy(price: number) {
    this.trailing.price = price;
    if ("percent" in this.input.buy_trailing) {
      this.trailing.stop = price * (1 + this.input.buy_trailing.percent);
    } else {
      // this.trailing.stop = price + this.trailing.distance;
    }
  }

  // private updateTrailingBuyDistance(price: number) {
  //   if ("distance" in this.input.buy_trailing) {
  //     this.trailing.distance = price * this.input.buy_trailing.distance;
  //   }
  // }

  private updateTrailingSell(price: number) {
    this.trailing.price = price;
    if ("percent" in this.input.sell_trailing) {
      this.trailing.stop = price * (1 - this.input.sell_trailing.percent);
    } else {
      // this.trailing.stop = price - this.trailing.distance;
    }
  }

  private updateTrailingSellDistance(price: number) {
    if ("distance" in this.input.sell_trailing) {
      this.trailing.distance = price * this.input.sell_trailing.distance;
    }
  }

  private processTrailingBuy(tick: ITick) {
    if (tick.high_price >= this.trailing.stop) {
      this.buy(this.trailing.stop);
      // this.updateTrailingSellDistance(tick);
      this.updateTrailingSell(tick.close_price);
    } else if (tick.low_price <= this.trailing.price) {
      this.updateTrailingBuy(tick.low_price);
    }
  }

  private processTrailingSell(tick: ITick) {
    if (tick.low_price <= this.trailing.stop) {
      this.sell(this.trailing.stop);
      // this.updateTrailingBuyDistance(tick);
      this.updateTrailingBuy(tick.close_price);
    } else if (tick.high_price >= this.trailing.price) {
      this.updateTrailingSell(tick.high_price);
    }
  }

  private initializeTrailingStrategy(tick: ITick) {
    if (this.portfolio.stable) {
      // this.updateTrailingBuyDistance(tick);
      this.updateTrailingBuy(tick.open_price);
    } else {
      // this.updateTrailingSellDistance(tick);
      this.updateTrailingSell(tick.open_price);
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
      fee: this.fee,
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

  feed(tick: ITick) {
    if (this.status === "initial") {
      this.status = "processing";
      this.processHolderStrategy(tick);
      this.initializeTrailingStrategy(tick);
    }
    if (this.portfolio.stable) {
      this.processTrailingBuy(tick);
    } else {
      this.processTrailingSell(tick);
    }
    return this.getSnapshot(tick);
  }
}
