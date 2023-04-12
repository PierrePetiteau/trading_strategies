import { IStrategySnapshot } from "@/src/helpers/strategies/trailing/trailing_strategy";
import { chartState, Tick } from "./chartState";
import { format } from "date-fns";

const resetChart = () => {
  chartState.ticks.set([]);
};

interface IHydrateChartParams {
  lastSnapshot?: IStrategySnapshot;
  currentSnapshot: IStrategySnapshot;
}
const hydrateChart = ({ lastSnapshot, currentSnapshot }: IHydrateChartParams) => {
  const { time, price, takeProfitPrice, stopLossPrice, position, control, portfolio, fees } = currentSnapshot;
  const isBuy = lastSnapshot ? lastSnapshot.position === "out" && position === "in" : false;
  const isSell = lastSnapshot ? lastSnapshot.position === "in" && position === "out" : false;

  const tick: Tick = {
    date: format(time, "HH:mm"),
    price: price,
    buy: isBuy ? price : undefined,
    sell: isSell ? price : undefined,
    buyTakeProfit: position === "out" ? parseFloat(takeProfitPrice.toFixed(2)) : undefined,
    buyStopLoss: position === "out" ? parseFloat(stopLossPrice.toFixed(2)) : undefined,
    sellTakeProfit: position === "in" ? parseFloat(takeProfitPrice.toFixed(2)) : undefined,
    sellStopLoss: position === "in" ? parseFloat(stopLossPrice.toFixed(2)) : undefined,
    holder: parseFloat(control.valueInUSD.toFixed(2)),
    trader: parseFloat(portfolio.valueInUSD.toFixed(2)),
    fees: fees,
    pnl: portfolio.valueInUSD - control.valueInUSD,
  };

  chartState.ticks.set((ticks = []) => [...ticks, tick]);
};

export const chartModifiers = { resetChart, hydrateChart };
