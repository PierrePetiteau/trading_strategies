import { observable } from "@legendapp/state";
import { IStrategySnapshot } from "@/src/helpers/strategies/trailing/trailing_strategy";
import { IStrategyInput } from "@/src/helpers/strategies/types";

interface ISnapshots {
  currentInput?: IStrategyInput;
  lastSnapshot?: IStrategySnapshot;
}

const initialSnapshot: ISnapshots = {};

export const snapshotsState = observable<ISnapshots>(initialSnapshot);
