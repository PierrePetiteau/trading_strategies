import { IStrategySnapshot } from "@/src/helpers/strategies/trailing/trailing_strategy";
import { chartState, Tick } from "./chartState";
import { format } from "date-fns";

const resetChart = () => {
  chartState.ticks.set([]);
};

const hydrateChart = (snapshot: IStrategySnapshot) => {
  const tick: Tick = {
    date: format(snapshot.time, "dd/MM/yyyy"),
    price: snapshot.price,
    takeProfit: snapshot.takeProfitPrice,
    stopLoss: snapshot.stopLossPrice,
    in: snapshot.portfolio.stable ? 0 : 1,
    out: snapshot.portfolio.stable ? 1 : 0,
    holder: snapshot.control.valueInUSD,
    trader: snapshot.portfolio.valueInUSD,
    fees: snapshot.fees,
    pnl: snapshot.portfolio.valueInUSD - snapshot.control.valueInUSD,
  };

  chartState.ticks.set((ticks = []) => [...ticks, tick]);
};

export const chartModifiers = { resetChart, hydrateChart };
