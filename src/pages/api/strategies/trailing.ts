import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/src/db";
import { IKLineSchema } from "@/src/db/shemas";
import { SSE } from "@/src/helpers/sse";
import { Cursor } from "mongoose";
import { IProfitAndLoss, IStrategyInput, ITick } from "@/src/helpers/strategies/types";
import { IStrategySnapshot, TrailingStrategy } from "@/src/helpers/strategies/trailing/trailing_strategy";

interface IRequestInput {
  data: IStrategyInput;
}

interface IResponseData {
  strategy: IStrategyInput;
  profit_and_loss: IProfitAndLoss;
  ticks: ITick[];
}

interface IResponseProcessing extends IResponseData {
  progress_percentage: number;
}

const DEFAULT_ENDING_DATE = 1677628740000;
const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 31 * DAY;
const YEAR = 365 * DAY;

function computeEmitInterval(input: IStrategyInput) {
  const endDate = input.period.ending_date ?? DEFAULT_ENDING_DATE;
  const duration = endDate - input.period.starting_date;
  return MIN;
  // if (duration <= HOUR) {
  //   return MIN;
  // } else if (duration <= 3 * HOUR) {
  //   return 3 * MIN;
  // } else if (duration <= 6 * HOUR) {
  //   return 6 * MIN;
  // } else if (duration <= 24 * HOUR) {
  //   return 30 * MIN;
  // } else {
  //   return HOUR;
  // }
}

interface IReadStreamParams {
  stream: Cursor<any, any>;
  sse: SSE;
  strategy: TrailingStrategy;
  input: IStrategyInput;
}

async function processStrategyOnPricesHistoryStream({ stream, sse, strategy, input }: IReadStreamParams) {
  const emitInterval = computeEmitInterval(input);

  return new Promise<void>((resolve, reject) => {
    try {
      let snapshot: IStrategySnapshot | undefined;
      stream.on("data", (kline: IKLineSchema) => {
        snapshot = strategy.feed({
          open_time: kline.open_time,
          open_price: kline.open_price,
          high_price: kline.high_price,
          low_price: kline.low_price,
          close_price: kline.close_price,
        });
        if (!(kline.open_time % emitInterval)) {
          sse.write({ event: "processing", data: { snapshot } });
          snapshot = undefined;
        }
      });
      stream.on("end", () => {
        sse.write({ event: "complete", data: { snapshot } });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}

export default async function perpetualTrailingStrategyHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.input || Array.isArray(req.query.input)) {
    res.status(400).json({ name: "Unexpected input format" });
    return;
  }

  const input = JSON.parse(req.query.input) as IStrategyInput;
  const strategy = new TrailingStrategy(input);
  const sse = new SSE(res);

  sse.init();

  const stream = db.models.eth_usdt_kline
    .find({
      open_time: {
        $gt: input.period.starting_date,
        $lt: input.period.ending_date ?? DEFAULT_ENDING_DATE,
      },
    })
    .cursor({
      batchSize: 24 * 60,
      timeout: 2 * 60000,
    });
  await processStrategyOnPricesHistoryStream({ stream, sse, strategy, input });

  stream.close();
  sse.end();
}
