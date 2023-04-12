import { algo, enc } from "crypto-js";
import { IStrategyInput } from "@/src/helpers/strategies/types";

const hashInput = (input: IStrategyInput) => {
  const stringToHash = JSON.stringify(input);
  const algorithm = "SHA256";
  const hash = algo[algorithm].create().update(stringToHash).finalize().toString(enc.Hex);
  return hash;
};

export const snapshotsHelpers = {
  hashInput,
};
