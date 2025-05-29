const express = require("express");
const partyRoutes = require("./routes/parties");
const setupSwagger = require("./swaggerSetup");

const app = express();

app.use(express.json());

setupSwagger(app); // apply swagger middleware

// ping to get data on interval
app.get("/ping-db", async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) throw new Error("Database not connected yet");

    // Query documents inside 'system' collection, not just listing collections
    const systemData = await db.collection("system").find({}).toArray();

    res.json({ status: "MongoDB is alive", system: systemData });
  } catch (error) {
    console.error("[/ping-db] Failed to retrieve system data:", error);
    res.status(500).json({ error: "Failed to retrieve system data" });
  }
});

app.use("/parties", partyRoutes);

module.exports = app;
