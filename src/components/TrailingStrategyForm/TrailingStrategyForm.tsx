import { FC } from "react";
import { TextInput } from "../Input/TextInput";
import { Form } from "react-final-form";
import { ButtonGroupInput } from "../Input/ButtonGroupInput";
import { snapshots } from "@/src/client/snapshots";
import { IStrategyInput } from "@/src/helpers/strategies/types";
import { addMonths, addWeeks, addYears, format, getTime, isDate, isValid, parse } from "date-fns";
import { scrollToBottomOfPage } from "@/src/client/html/scroll";

export interface IPair {
  key: "BTC-USDT" | "ETH-USDT" | "BNB-USDT" | "MATIC-USDT";
}

type TrailingStrategyFormProps = {
  pair: IPair["key"];
};

interface IFormOutput {
  duration: "7d" | "1m" | "6m" | "1y" | "All";
  "fee-percentage": string;
  "initial-usdt-amount": string;
  "starting-date": string;
  "trailing-percentage": string;
}

const computeEndingDate = (startDate: Date, duration: "7d" | "1m" | "6m" | "1y" | "All") => {
  switch (duration) {
    case "7d":
      return addWeeks(startDate, 1);
    case "1m":
      return addMonths(startDate, 1);
    case "6m":
      return addMonths(startDate, 6);
    case "1y":
      return addYears(startDate, 1);
    case "All":
      return undefined;
  }
};

export const TrailingStrategyForm: FC<TrailingStrategyFormProps> = ({ pair }) => {
  const onSubmit = (values: IFormOutput) => {
    const parsedDate = parse(values["starting-date"], "dd/MM/yyyy", new Date());
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
              <TextInput id={"trailing-percentage"} label="Trailing percentage" placeholder="0%" defaultValue="1.0%" />
              <TextInput id={"fee-percentage"} label="Fee percentage" placeholder="0%" defaultValue="0.1%" />
              <TextInput
                id={"starting-date"}
                label="Starting date"
                placeholder="01/01/2023"
                defaultValue="01/01/2023"
                defaultValueLabel="2023"
                validate={(v) => {
                  const parsedDate = parse(v, "dd/MM/yyyy", new Date());
                  if (isDate(parsedDate) && isValid(parsedDate) && v === format(parsedDate, "dd/MM/yyyy")) {
                    return undefined;
                  }
                  return "Wrong format";
                }}
              />
              <ButtonGroupInput id={"duration"} label="Duration" buttons={["7d", "1m", "6m", "1y", "All"]} />
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
