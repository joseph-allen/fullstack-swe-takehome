const express = require("express");
const partyRoutes = require("./routes/parties");
const setupSwagger = require("./swaggerSetup");

const app = express();

app.use(express.json());

setupSwagger(app); // apply swagger middleware

app.get("/", (req, res) => {
  res.send("Hello from Express backend!");
});

app.use("/parties", partyRoutes);

app.get("/ping-db", async (req, res) => {
  try {
    // ping to check alive
    const db = req.app.locals.db;
    if (!db) throw new Error("Database not connected yet");

    // Query documents inside 'system' collection, not just listing collections
    const systemData = await db.collection("system").find({}).toArray();

    res.json({ status: "MongoDB is alive", system: systemData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve system data" });
  }
});

module.exports = app;
