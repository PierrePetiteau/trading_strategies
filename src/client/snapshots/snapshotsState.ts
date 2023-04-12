import { observable } from "@legendapp/state";
import { IStrategySnapshot } from "@/src/helpers/strategies/trailing/trailing_strategy";
import { IStrategyInput } from "@/src/helpers/strategies/types";

type ISnapshot = IStrategySnapshot & { _id: number };

interface ISnapshotsMap {
  [hash: string]: ISnapshot[];
}

interface ISnapshots {
  "BTC-USDT": ISnapshotsMap;
  "ETH-USDT": ISnapshotsMap;
  "BNB-USDT": ISnapshotsMap;
  "MATIC-USDT": ISnapshotsMap;
  currentInput?: IStrategyInput;
  lastSnapshot?: ISnapshot
}

const initialSnapshot: ISnapshots = {
  "BTC-USDT": {},
  "ETH-USDT": {},
  "BNB-USDT": {},
  "MATIC-USDT": {},
};

export const snapshotsState = observable<ISnapshots>(initialSnapshot);
