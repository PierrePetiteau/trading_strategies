import { IStrategySnapshot } from "@/src/helpers/strategies/trailing/trailing_strategy";
import { chartState, Tick } from "./chartState";
import { format } from "date-fns";

const formatPrice = (price: number) => parseFloat(price.toFixed(2));

const resetChart = () => {
  chartState.ticks.set([]);
};

interface IHydrateChartParams {
  lastSnapshot?: IStrategySnapshot;
  currentSnapshot: IStrategySnapshot;
}
const hydrateChart = ({ lastSnapshot, currentSnapshot }: IHydrateChartParams) => {
  const { time, price, takeProfitPrice, stopLossPrice, position, control, portfolio, fees, trade } = currentSnapshot;
  let buy: number | undefined = undefined;
  let buyTakeProfit: number | undefined = undefined;
  let buyStopLoss: number | undefined = undefined;

  let sell: number | undefined = undefined;
  let sellTakeProfit: number | undefined = undefined;
  let sellStopLoss: number | undefined = undefined;

  if (trade && trade.type === "buy" && trade.trigger === "stop_loss") {
    buy = lastSnapshot?.stopLossPrice;
    buyStopLoss = lastSnapshot?.stopLossPrice;
    buyTakeProfit = lastSnapshot?.takeProfitPrice;
  } else if (trade && trade.type === "buy" && trade.trigger === "take_profit") {
    buy = lastSnapshot?.takeProfitPrice;
    buyTakeProfit = lastSnapshot?.takeProfitPrice;
    buyStopLoss = lastSnapshot?.stopLossPrice;
  } else if (trade && trade.type === "sell" && trade.trigger === "stop_loss") {
    sell = lastSnapshot?.stopLossPrice;
    sellStopLoss = lastSnapshot?.stopLossPrice;
    sellTakeProfit = lastSnapshot?.takeProfitPrice;
  } else if (trade && trade.type === "sell" && trade.trigger === "take_profit") {
    sell = lastSnapshot?.takeProfitPrice;
    sellTakeProfit = lastSnapshot?.takeProfitPrice;
    sellStopLoss = lastSnapshot?.stopLossPrice;
  }

  const tick: Tick = {
    date: format(time, "HH:mm"),
    price: price,
    buy,
    sell,
    buyTakeProfit: position === "out" ? formatPrice(takeProfitPrice) : buyTakeProfit,
    buyStopLoss: position === "out" ? formatPrice(stopLossPrice) : buyStopLoss,
    sellTakeProfit: position === "in" ? formatPrice(takeProfitPrice) : sellTakeProfit,
    sellStopLoss: position === "in" ? formatPrice(stopLossPrice) : sellStopLoss,
    holder: parseFloat(control.valueInUSD.toFixed(2)),
    trader: parseFloat(portfolio.valueInUSD.toFixed(2)),
    fees: fees,
    pnl: portfolio.valueInUSD - control.valueInUSD,
  };

  chartState.ticks.set((ticks = []) => [...ticks, tick]);
};

export const chartModifiers = { resetChart, hydrateChart };
