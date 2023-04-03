import mongoose from "mongoose";

(async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(process.env.DATABASE_URL!);
})();
