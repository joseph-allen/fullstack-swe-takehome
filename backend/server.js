const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Express backend!");
});

app.get("/ping-db", async (req, res) => {
  try {
    // db check for mock injection
    const admin = req.app.locals.db?.admin?.();
    const info = await admin.ping();
    res.json({ status: "MongoDB is alive", info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to ping MongoDB" });
  }
});

module.exports = app;
