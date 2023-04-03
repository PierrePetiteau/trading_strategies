// models/user.ts

import { Model, model } from "mongoose";
import { IKLineSchema, kLineSchema } from "./shemas";

let eth_usdt_kline: Model<IKLineSchema>;

try {
  eth_usdt_kline = model("eth_usdt_kline") as Model<IKLineSchema>;
} catch (error) {
  eth_usdt_kline = model("eth_usdt_kline", kLineSchema);
}

export const models = {
  // btc_usdt_kline: mongoose.model("btc_usdt_kline", kLineSchema),
  eth_usdt_kline,
  // bnb_usdt_kline: mongoose.model("bnb_usdt_kline", kLineSchema),
  // matic_usdt_kline: mongoose.model("matic_usdt_kline", kLineSchema),
};
