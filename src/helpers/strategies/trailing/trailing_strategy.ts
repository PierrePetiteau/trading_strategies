import { format } from "date-fns";
import { IStrategyInput, ITick } from "../types";

export interface IStrategySnapshot {
  time: number;
  trade?: ITrade;
  control: { volatile: number; stable: number; valueInUSD: number };
  portfolio: { volatile: number; stable: number; valueInUSD: number };
  position: "in" | "out";
  price: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  fees: number;
  tradeAmount: number;
}

interface ITrade {
  type: "buy" | "sell";
  trigger: "stop_loss" | "take_profit";
}

export class TrailingStrategy {
  private status: "initial" | "processing" = "initial";
  private trailingStopPercent = 0;
  private swapFee = 0;

  private currentTime = 0;
  private currentPrice = 0;
  private inPosition = false;
  private stopLossPrice = 0;
  private takeProfitPrice = 0;
  private control: { volatile: number; stable: number };
  private portfolio: { volatile: number; stable: number };
  private fees = 0;
  private tradeAmount = 0;

  constructor(input: IStrategyInput) {
    console.log('---------', 'input', input);
    this.trailingStopPercent = input.trailingPercent;
    this.swapFee = input.fee;
    this.control = {
      volatile: 0,
      stable: input.initial_amount,
    };
    this.portfolio = {
      volatile: 0,
      stable: input.initial_amount,
    };
    this.inPosition = Boolean(this.portfolio.volatile);
  }

  private hold() {
    if (!Boolean(this.control.stable)) {
      return;
    }

    this.control.volatile = this.control.stable / this.currentPrice;
    this.control.stable = 0;
  }

  private buy() {
    const exact = this.portfolio.stable / this.currentPrice;
    const fee = exact * this.swapFee;

    this.portfolio.volatile = exact - fee;
    this.portfolio.stable = 0;
    this.inPosition = true;
    this.fees += fee * this.currentPrice;
    this.tradeAmount++;
  }

  private sell() {
    const exact = this.portfolio.volatile * this.currentPrice;
    const fee = exact * this.swapFee;

    this.portfolio.stable = exact - fee;
    this.portfolio.volatile = 0;
    this.inPosition = false;
    this.fees += fee;
    this.tradeAmount++;
  }

  private swap(trigger: ITrade["trigger"]): ITrade {
    if (this.inPosition) {
      this.sell();
      return { type: "sell", trigger };
    } else {
      this.buy();
      return { type: "buy", trigger };
    }
  }

  private reinitializeStopLossAndTakeProfit() {
    if (this.inPosition) {
      this.stopLossPrice = this.currentPrice * (1 - this.trailingStopPercent);
      this.takeProfitPrice = this.currentPrice * (1 + this.trailingStopPercent);
    } else {
      this.stopLossPrice = this.currentPrice * (1 + this.trailingStopPercent);
      this.takeProfitPrice = this.currentPrice * (1 - this.trailingStopPercent);
    }
  }

  private updateStopLossAndTakeProfit() {
    if (this.inPosition) {
      this.takeProfitPrice = Math.min(this.takeProfitPrice, this.currentPrice * (1 + this.trailingStopPercent));
      this.stopLossPrice = Math.max(this.stopLossPrice, this.currentPrice * (1 - this.trailingStopPercent));
    } else {
      this.takeProfitPrice = Math.max(this.takeProfitPrice, this.currentPrice * (1 - this.trailingStopPercent));
      this.stopLossPrice = Math.min(this.stopLossPrice, this.currentPrice * (1 + this.trailingStopPercent));
    }
  }

  private getSnapshot(): IStrategySnapshot {
    return {
      time: this.currentTime,
      control: {
        ...this.control,
        valueInUSD: this.control.volatile ? this.control.volatile * this.currentPrice : this.control.stable,
      },
      portfolio: {
        ...this.portfolio,
        valueInUSD: this.portfolio.volatile ? this.portfolio.volatile * this.currentPrice : this.portfolio.stable,
      },
      position: this.inPosition ? "in" : "out",
      price: this.currentPrice,
      stopLossPrice: this.stopLossPrice,
      takeProfitPrice: this.takeProfitPrice,
      fees: this.fees,
      tradeAmount: this.tradeAmount,
    };
  }

  feed(tick: ITick): IStrategySnapshot {
    let trade: ITrade | undefined = undefined;
    this.currentTime = tick.open_time;
    this.currentPrice = tick.open_price;

    if (this.status === "initial") {
      this.status = "processing";
      this.hold();
      this.reinitializeStopLossAndTakeProfit();
    }

    if (this.inPosition && this.currentPrice >= this.takeProfitPrice) {
      trade = this.swap("take_profit");
      this.reinitializeStopLossAndTakeProfit();
    } else if (this.inPosition && this.currentPrice <= this.stopLossPrice) {
      trade = this.swap("stop_loss");
      this.reinitializeStopLossAndTakeProfit();
    } else if (!this.inPosition && this.currentPrice <= this.takeProfitPrice) {
      trade = this.swap("take_profit");
      this.reinitializeStopLossAndTakeProfit();
    } else if (!this.inPosition && this.currentPrice >= this.stopLossPrice) {
      trade = this.swap("stop_loss");
      this.reinitializeStopLossAndTakeProfit();
    } else {
      this.updateStopLossAndTakeProfit();
    }

    return { ...this.getSnapshot(), trade };
  }

  static debugSnapshot(snapshot: IStrategySnapshot) {
    const message = `${format(snapshot.time, "dd/MM - hh:mm")}
    \t${snapshot.trade ? `${snapshot.trade?.type} trigger by ${snapshot.trade?.trigger}` : ""}

    \tprice ${snapshot.price.toFixed(2)}
    \tstopLossPrice ${snapshot.stopLossPrice.toFixed(2)}
    \ttakeProfitPrice ${snapshot.takeProfitPrice.toFixed(2)}

    \tcontrol ${snapshot.control.valueInUSD.toFixed(2)}
    \tportfolio ${snapshot.portfolio.valueInUSD.toFixed(2)} ${snapshot.position}
    \tpnl amount ${(snapshot.portfolio.valueInUSD - snapshot.control.valueInUSD).toFixed(2)}$
    \tpnl percent ${((snapshot.portfolio.valueInUSD / snapshot.control.valueInUSD - 1) * 100).toFixed(2)}%
    \tfees ${snapshot.fees.toFixed(4)}
    \ttrades ${snapshot.tradeAmount}
    `;

    console.log("---------\n", message, "\n---------");

    return message;
  }
}
