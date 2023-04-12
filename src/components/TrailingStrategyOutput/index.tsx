import { FC } from "react";
import { Card } from "react-daisyui";

type TrailingStrategyOutputProps = {
  startDate?: string;
  endDate?: string;
  portfolioControlValue?: number;
  portfolioValue?: number;
  tradesAmount?: number;
  feesAmount?: number;
  pnlAmount?: number;
  pnlPercent?: number;
};

interface IOutputItem {
  label: string;
  value: string;
  className?: string;
}

const TrailingStrategyOutput: FC<TrailingStrategyOutputProps> = ({
  startDate = "XX/XX/XX",
  endDate = "XX/XX/XX",
  portfolioControlValue = 0,
  portfolioValue = 0,
  tradesAmount = 0,
  feesAmount = 0,
  pnlAmount = 0,
  pnlPercent = 0,
}) => {
  const items: IOutputItem[] = [
    { label: "Dates", value: `${startDate} - ${endDate}` },
    { label: "Holder (control)", value: `${portfolioControlValue.toFixed(2)}$` },
    { label: "Trader (experiment)", value: `${portfolioValue.toFixed(2)}$` },
    { label: "Trades", value: `${tradesAmount}` },
    { label: "Fees", value: `${feesAmount?.toFixed(2)}` },
    {
      label: "PNL",
      value: `${pnlAmount.toFixed(2)}$ / ${pnlPercent.toFixed(2)}%`,
      className: !pnlAmount ? "" : pnlAmount > 0 ? "text-success" : "text-error",
    },
  ];

  return (
    <div>
      <h2 className="mt-0">Strategy output</h2>
      <div className="grid grid-flow-col grid-rows-6 sm:grid-rows-3 grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 auto-rows-fr">
        {items.map((item) => (
          <Card key={item.label} className="flex flex-row p-4 bg-base-300">
            <p className="my-0">{item.label}</p>
            <div className="flex grow" />
            <p className={"my-0 " + item.className}>{item.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrailingStrategyOutput;
