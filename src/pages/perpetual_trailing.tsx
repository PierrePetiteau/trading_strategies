import Head from "next/head";
import Link from "next/link";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { observable } from "@legendapp/state";
import { IStrategyInput } from "../helpers/strategies/types";
import { IStrategySnapshot, TrailingStrategy } from "../helpers/strategies/trailing/trailing_strategy";
import { Computed } from "@legendapp/state/react";

const defaultInput: IStrategyInput = {
  initial_portfolio: { tokenVolatile: { symbol: "ETH", amount: 0 }, tokenStable: { symbol: "USDT", amount: 1000 } },
  trailingPercent: 0.1,
  fee: 0.001,
  // fee: 0.000,
  period: { starting_date: 1640995200000 },
};

const snapshots = observable<(IStrategySnapshot & { _id: number })[]>([]);

export default function PerpetualTrailing() {
  // const [snapshots, setSnapshots] = useState<IStrategySnapshot[]>([]);
  console.log("---------", "snapshots.length", snapshots.length);

  const isProcessingRef = useRef(false);
  const kLinesAmount = observable(0);

  const fetchData = async (isProcessingRef: MutableRefObject<boolean>) => {
    isProcessingRef.current = true;
    const params = { input: JSON.stringify(defaultInput) };
    const url = new URL("/api/strategies/trailing", window.location.origin);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    const eventSource = new EventSource(url.toString());

    // const eventSource = new EventSource("/api/strategies/perpetual_trailing");

    eventSource.addEventListener("processing", (event) => {
      const data = JSON.parse(event.data);
      // processingPercentage.set(data.progress_percentage);
      snapshots.push({ ...data, _id: snapshots.length });
      // setSnapshots((prev) => [...prev, data]);
      console.log("Received processing event:", JSON.stringify(data, null, " "));
    });

    eventSource.addEventListener("complete", (event) => {
      const data = JSON.parse(event.data);
      // console.log("Received complete event:", JSON.stringify(JSON.parse(event.data), null, " "));
      isProcessingRef.current = false;
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  };

  useEffect(() => {
    if (!isProcessingRef.current) {
      fetchData(isProcessingRef);
    }
  }, []);

  return (
    <>
      <h1>Snapshot</h1>
      <Computed>
        {() => {
          const lastSnapshot = snapshots[snapshots.length - 1].get();

          return <pre>{lastSnapshot ? <code>{TrailingStrategy.debugSnapshot(lastSnapshot)}</code> : null}</pre>;
        }}
      </Computed>
    </>
  );
}
