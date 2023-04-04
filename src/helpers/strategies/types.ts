export interface ITokenSymbols {
  stables: "USDT";
  volatiles: "BTC" | "ETH" | "BNB" | "MATIC";
}

/**
 * Input
 */
export interface IInitialPortfolio {
  tokenStable: { symbol: ITokenSymbols["stables"]; amount: number };
  tokenVolatile: { symbol: ITokenSymbols["volatiles"]; amount: number };
}

export interface IStrategyInput {
  initial_portfolio: IInitialPortfolio;
  buy_trailing: { percent: number } | { distance: number };
  sell_trailing: { percent: number } | { distance: number };
  fee: number;
  period: { starting_date: number; ending_date?: number };
}

/**
 * Prices history
 */
export interface ITick {
  open_time: number;
  open_price: number;
  close_price: number;
  high_price: number;
  low_price: number;
}

/**
 * Strategy
 *
 * Todo create an algorithm to compute the snapshot interval from the experiment duration
 */
export interface IPortfolio {
  volatile: number;
  stable: number;
  valueInUSD: number;
}

export interface IProfitAndLoss {
  amount: number;
  percent: number;
  duration: number;
  trades: number;
  fee: number;
}

export interface IStrategySnapshot {
  timestamp: number;
  price: number;
  portfolio: IPortfolio;
  control: IPortfolio; // holder
  pnl: IProfitAndLoss;
}

export interface IStrategyChunk {
  snapshots: IStrategySnapshot[];
  interval: number; // "1h" | "3h" | "6h" | "12h" | "24h";
}
