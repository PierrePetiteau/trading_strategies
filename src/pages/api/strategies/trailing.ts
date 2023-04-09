import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/src/db";
import { IKLineSchema } from "@/src/db/shemas";
import { SSE } from "@/src/helpers/sse";
import { Cursor } from "mongoose";
import { IProfitAndLoss, IStrategyInput, ITick } from "@/src/helpers/strategies/types";
import { TrailingStrategy } from "@/src/helpers/strategies/trailing/trailing_strategy";

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
const MIN = 60000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const INTERVAL: number = MIN;
const DOCUMENT_LIMIT = 10 * (DAY / INTERVAL);

interface IReadStreamParams {
  stream: Cursor<any, any>;
  sse: SSE;
  strategy: TrailingStrategy;
}

async function processStrategyOnPricesHistoryStream({ stream, sse, strategy }: IReadStreamParams) {
  let snapshotIndex = 0;
  let klineIndex = 0;

  return new Promise<void>((resolve, reject) => {
    try {
      stream.on("data", (kline: IKLineSchema) => {
        klineIndex++;
        console.log("---------", "kline processed", klineIndex);
        const snapshot = strategy.feed({
          open_time: kline.open_time,
          open_price: kline.open_price,
          high_price: kline.high_price,
          low_price: kline.low_price,
          close_price: kline.close_price,
        });
        if (!(kline.open_time % DAY)) {
          snapshotIndex++;
          console.log("---------", "snapshot emited", snapshotIndex);
          sse.write({ event: "processing", data: snapshot });
        }
      });
      stream.on("end", () => {
        const data: IResponseData = {} as IResponseData;
        sse.write({ event: "complete", data });
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
        $mod: [INTERVAL, 0],
      },
    })
    .limit(DOCUMENT_LIMIT)
    .cursor();
  await processStrategyOnPricesHistoryStream({ stream, sse, strategy });

  stream.close();
  sse.end();
}
