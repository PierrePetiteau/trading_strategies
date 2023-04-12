import { observable } from "@legendapp/state";

export type Tick = {
  date: string;
  price: number;
  takeProfit: number;
  stopLoss: number;
  in?: number;
  out?: number;
  holder: number;
  trader: number;
  fees: number;
  pnl: number;
};

export type ChartType = {
  ticks: Tick[];
};

const initialChart: ChartType = { ticks: [] };

export const chartState = observable(initialChart);

// persistObservable(chartState, { local: "chartState", persistLocal: ObservablePersistLocalStorage });
