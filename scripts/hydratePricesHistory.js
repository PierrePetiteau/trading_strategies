const fs = require("fs");
const csv = require("csv-parser");
const { default: mongoose } = require("mongoose");

const folderPath = "./data/klines/ETHUSDT";
const collectionName = "eth_usdt_kline";

const kLineSchema = new mongoose.Schema({
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

const buildModelFromCsvRow = (row) => {
  return {
    _id: parseInt(row.open_time),
    open_time: parseInt(row.open_time),
    open_price: parseFloat(row.open_price),
    high_price: parseFloat(row.high_price),
    low_price: parseFloat(row.low_price),
    close_price: parseFloat(row.close_price),
    volume: parseFloat(row.volume),
    close_time: parseInt(row.close_time),
    quote_asset_volume: parseFloat(row.quote_asset_volume),
    trade_amount: parseInt(row.trade_amount),
    taker_buy_base_asset_volume: parseFloat(row.taker_buy_base_asset_volume),
    taker_buy_quote_asset_volume: parseFloat(row.taker_buy_quote_asset_volume),
  };
};

const hydrateDB = async (model) => {
  try {
    await model.save();
  } catch (error) {
    console.log("---------", "error", error);
  }
};

async function processCsvFile(filePath) {
  console.log("---------processCsvFile", "start", filePath);
  return new Promise((resolve, reject) => {
    try {
      const stream = fs.createReadStream(filePath, { highWaterMark: 1024 });
      const models = [];
      stream
        .pipe(csv())
        .on("data", async (row) => {
          const model = buildModelFromCsvRow(row);
          models.push(model);
        })
        .on("end", () => {
          stream.close();
          resolve(models);
          console.log("---------processCsvFile", "success", filePath);
        });
    } catch (error) {
      console.log("---------", "error", error);
      reject(error);
    }
  });
}

async function listFilesInFolder(folderPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (error, files) => {
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    });
  });
}

const main = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  const Model = mongoose.model(collectionName, kLineSchema);

  try {
    const files = await listFilesInFolder(folderPath);

    for (const filename of files) {
      if (!filename.includes(".csv")) {
        continue;
      }
      const models = await processCsvFile(folderPath + "/" + filename);
      const operations = models.map((model) => ({
        updateOne: {
          filter: { _id: model._id },
          update: model,
          upsert: true,
        },
      }));
      await Model.bulkWrite(operations);
    }
  } catch (error) {
    console.log("---------", "error", error);
  }

  setTimeout(() => {
    mongoose.disconnect();
  }, 5000);
};

main();
