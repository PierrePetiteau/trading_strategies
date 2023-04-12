import { IStrategyInput } from "@/src/helpers/strategies/types";
import { snapshotsState } from "./snapshotsState";
import { chart } from "../chart";

interface IPostStrategyTrailingParams {
  input: IStrategyInput;
  pair: "BTC-USDT" | "ETH-USDT" | "BNB-USDT" | "MATIC-USDT";
}

const buildEventSourceURL = (base: string, params: Object) => {
  const url = new URL(base, window.location.origin);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
};

const postStrategyTrailing = async ({ input }: IPostStrategyTrailingParams) => {
  const params = { input: JSON.stringify(input) };
  const eventSource = new EventSource(buildEventSourceURL("/api/strategies/trailing", params));

  chart.modifiers.resetChart();

  eventSource.addEventListener("processing", (event) => {
    const data = JSON.parse(event.data);

    snapshotsState.lastSnapshot?.set(data.snapshot);
    chart.modifiers.hydrateChart(data.snapshot);
  });

  eventSource.addEventListener("complete", (event) => {
    eventSource.close();
  });

  return () => {
    eventSource.close();
  };
};

export const snapshotsModifiers = {
  postStrategyTrailing,
};
