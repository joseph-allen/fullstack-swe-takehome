const app = require("./server");
const mongoose = require("mongoose");

const port = 4000;
const mongoUri =
  process.env.MONGODB_URI || "mongodb://root:example@mongodb:27017";

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Express server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
