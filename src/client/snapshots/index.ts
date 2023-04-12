import { snapshotsHelpers } from "./snapshotsHelpers";
import { snapshotsModifiers } from "./snapshotsModifier";
import { snapshotsState } from "./snapshotsState";

export const snapshots = {
  state: snapshotsState,
  modifiers: snapshotsModifiers,
  helpers: snapshotsHelpers,
};
