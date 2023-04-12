import { algo, enc } from "crypto-js";
import { IStrategyInput } from "@/src/helpers/strategies/types";
import { snapshotsState } from "./snapshotsState";

const hashInput = (input: IStrategyInput) => {
  const stringToHash = JSON.stringify(input);
  const algorithm = "SHA256";
  const hash = algo[algorithm].create().update(stringToHash).finalize().toString(enc.Hex);
  return hash;
};

interface IGetLastParams {
  pair: "BTC-USDT" | "ETH-USDT" | "BNB-USDT" | "MATIC-USDT";
}

const getLast = ({ pair }: IGetLastParams) => {
  const currentInput = snapshotsState.currentInput?.get();
  if (!currentInput) {
    return undefined;
  }

  const hash = hashInput(currentInput);
  if (!snapshotsState[pair][hash].length) {
    return undefined;
  }

  const index = snapshotsState[pair][hash].length - 1;
  return snapshotsState[pair][hash][index].get();
};

export const snapshotsHelpers = {
  hashInput,
  getLast,
};
