import { format } from "date-fns";
import { useRouter } from "next/router";
import { Computed } from "@legendapp/state/react";
import { Card } from "react-daisyui";
import { snapshots } from "@/src/client/snapshots";
import { Chart } from "@/src/components/Chart/Chart";
import TrailingStrategyForm, { IPair } from "@/src/components/TrailingStrategyForm";
import TrailingStrategyOutput from "@/src/components/TrailingStrategyOutput";
import { isString } from "@/src/helpers/types";

const availablePairs = ["ETH-USDT"];

const PairPage = () => {
  const router = useRouter();
  const pair = router.query["tokenA-tokenB"] as IPair["key"];

  if (pair === undefined) {
    return <Card className="m-[24px] p-[24px] border-neutral-content">Loading</Card>;
  }

  if (!isString(pair) || !availablePairs.includes(pair)) {
    return (
      <Card className="m-[24px] p-[24px] border-error max-w-screen-lg">
        <h2 className="mt-0 text-error">Invalid url</h2>
        <p>
          Invalid argument detected<code>{pair}</code>
        </p>
        <p className="m-0">
          Try one of the following
          <code>{availablePairs.join(", ")}</code>
        </p>
      </Card>
    );
  }

  return (
    <div className="max-w-screen-lg">
      <Card className="m-[24px] p-[24px] bg-base-200">
        <TrailingStrategyForm pair={pair as IPair["key"]} />
      </Card>
      <Card className="m-[24px] p-[24px] bg-base-200">
        <Computed>
          {() => {
            const currentInput = snapshots.state.currentInput?.get();
            const lastSnapShot = snapshots.state.lastSnapshot?.get();

            const portfolioControlValue = lastSnapShot?.control.valueInUSD ?? 0;
            const portfolioValue = lastSnapShot?.portfolio.valueInUSD ?? 0;
            const output = {
              startDate: currentInput ? format(currentInput.period.starting_date, "dd/MM/yyyy") : undefined,
              endDate: lastSnapShot ? format(lastSnapShot.time, "dd/MM/yyyy") : undefined,
              portfolioControlValue,
              portfolioValue,
              tradesAmount: lastSnapShot?.tradeAmount,
              feesAmount: lastSnapShot?.fees,
              pnlAmount: lastSnapShot ? portfolioValue - portfolioControlValue : undefined,
              pnlPercent: lastSnapShot ? (portfolioValue / portfolioControlValue) * 100 - 100 : undefined,
            };

            return (
              <TrailingStrategyOutput
                startDate={output.startDate}
                endDate={output.endDate}
                portfolioControlValue={output.portfolioControlValue}
                portfolioValue={output.portfolioValue}
                tradesAmount={output.tradesAmount}
                feesAmount={output.feesAmount}
                pnlAmount={output.pnlAmount}
                pnlPercent={output.pnlPercent}
              />
            );
          }}
        </Computed>
      </Card>
      <Card id={"chart-container"} className="m-[24px] p-[24px] bg-base-200">
        <h2 className="mt-0">{pair}</h2>
        <Chart />
      </Card>
    </div>
  );
};

export default PairPage;
