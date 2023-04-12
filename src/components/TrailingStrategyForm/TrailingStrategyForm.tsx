import { FC } from "react";
import { TextInput } from "../Input/TextInput";
import { Form } from "react-final-form";
import { ButtonGroupInput } from "../Input/ButtonGroupInput";
import { snapshots } from "@/src/client/snapshots";
import { IStrategyInput } from "@/src/helpers/strategies/types";
import { addHours, addMinutes, format, getTime, isDate, isValid, parse } from "date-fns";
import { scrollToBottomOfPage } from "@/src/client/html/scroll";

export interface IPair {
  key: "BTC-USDT" | "ETH-USDT" | "BNB-USDT" | "MATIC-USDT";
}

type TrailingStrategyFormProps = {
  pair: IPair["key"];
};

interface IFormOutput {
  duration: "30m" | "1h" | "3h" | "6h" | "24h";
  "fee-percentage": string;
  "initial-usdt-amount": string;
  "starting-date": string;
  "trailing-percentage": string;
}

const computeEndingDate = (startDate: Date, duration: "30m" | "1h" | "3h" | "6h" | "24h") => {
  switch (duration) {
    case "30m":
      return addMinutes(startDate, 30);
    case "1h":
      return addHours(startDate, 1);
    case "3h":
      return addHours(startDate, 3);
    case "6h":
      return addHours(startDate, 6);
    case "24h":
      return addHours(startDate, 24);
  }
};

export const TrailingStrategyForm: FC<TrailingStrategyFormProps> = ({ pair }) => {
  const onSubmit = (values: IFormOutput) => {
    const parsedDate = parse(values["starting-date"], "dd/MM/yyyy HH:mm", new Date());
    const endingDate = computeEndingDate(parsedDate, values.duration);

    const input: IStrategyInput = {
      initial_amount: parseInt(values["initial-usdt-amount"]),
      trailingPercent: parseFloat(values["trailing-percentage"]) / 100,
      fee: parseFloat(values["fee-percentage"]) / 100,
      period: {
        starting_date: getTime(parsedDate),
        ending_date: endingDate ? getTime(endingDate) : undefined,
      },
    };
    snapshots.state.currentInput?.set(input);
    snapshots.modifiers.postStrategyTrailing({ pair, input });
    scrollToBottomOfPage();
  };

  const validate = (values: IFormOutput) => {
    // Handle form validation logic here
    const errors = {};
    // Add validation errors to the 'errors' object if needed
    return errors;
  };

  return (
    <div>
      <h2 className="mt-0">Strategy input</h2>
      <Form onSubmit={onSubmit} validate={validate}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-control grid grid-flow-col grid-rows-6 sm:grid-rows-3 grid-cols-1 sm:grid-cols-2 gap-x-10">
              <TextInput id={"initial-usdt-amount"} label="Initial USDT amount" placeholder="0" defaultValue="1000" />
              <TextInput id={"trailing-percentage"} label="Trailing percentage" placeholder="1.0%" defaultValue="1.0%" />
              <TextInput id={"fee-percentage"} label="Fee percentage" placeholder="0%" defaultValue="0.0%" />
              <TextInput
                id={"starting-date"}
                label="Starting date"
                placeholder="01/01/2022 00:00"
                defaultValue="01/01/2022 00:00"
                defaultValueLabel="2022"
                validate={(v) => {
                  const parsedDate = parse(v, "dd/MM/yyyy HH:mm", new Date());
                  const range = { min: 1577836800000, max: 1677628740000 };

                  if (!isDate(parsedDate) || !isValid(parsedDate) || v !== format(parsedDate, "dd/MM/yyyy HH:mm")) {
                    return "Wrong format";
                  }
                  if (parsedDate.getTime() < range.min || parsedDate.getTime() > range.max) {
                    return `Only accept date between ${format(range.min, "dd/MM/yyyy")} - ${format(range.max, "dd/MM/yyyy")}`;
                  }

                  return undefined;
                }}
              />
              <ButtonGroupInput
                id={"duration"}
                label="Duration"
                buttons={["30m", "1h", "3h", "6h", "24h"]}
                defaultValue="24h"
              />
              <button type="submit" className="btn btn-primary self-end mt-4 mb-8">
                Apply
              </button>
            </div>
          </form>
        )}
      </Form>
    </div>
  );
};

export default TrailingStrategyForm;
