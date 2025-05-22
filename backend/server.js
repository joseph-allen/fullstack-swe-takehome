const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 4000;

const mongoUri =
  process.env.MONGODB_URI || "mongodb://root:example@mongodb:27017";

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Express backend!");
});

app.get("/ping-db", async (req, res) => {
  try {
    const admin = mongoose.connection.db.admin();
    const info = await admin.ping();
    res.json({ status: "MongoDB is alive", info });
  } catch (error) {
    res.status(500).json({ error: "Failed to ping MongoDB" });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
  });
}

module.exports = app;
