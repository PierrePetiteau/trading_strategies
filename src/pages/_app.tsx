import "@/src/styles/globals.css";
import type { AppProps } from "next/app";
import { enableLegendStateReact } from "@legendapp/state/react";
import { usePersistObservable } from "../client/appState";
import { AppLayout } from "../components/Layout/AppLayout";

enableLegendStateReact();

export default function App({ Component, pageProps }: AppProps) {
  usePersistObservable();
  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  );
}
