import { Document, Model, model, Schema } from "mongoose";

export interface IKLineSchema extends Document {
  _id: number;
  open_time: number;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  volume: number;
  close_time: number;
  quote_asset_volume: number;
  trade_amount: number;
  taker_buy_base_asset_volume: number;
  taker_buy_quote_asset_volume: number;
}

export const kLineSchema = new Schema<IKLineSchema>({
  _id: { type: Number, required: true, unique: true, index: true },
  open_time: Number,
  open_price: Number,
  high_price: Number,
  low_price: Number,
  close_price: Number,
  volume: Number,
  close_time: Number,
  quote_asset_volume: Number,
  trade_amount: Number,
  taker_buy_base_asset_volume: Number,
  taker_buy_quote_asset_volume: Number,
});
