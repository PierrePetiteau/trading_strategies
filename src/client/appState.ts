import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { useEffect } from "react";

export const appState = observable({
  settings: {
    showSidebar: false,
  },
  count: 0,
});

export function usePersistObservable() {
  useEffect(() => {
    persistObservable(appState, { local: "appState", persistLocal: ObservablePersistLocalStorage });
  }, []);
}
