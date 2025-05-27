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
    const admin = req.app.locals.db?.admin?.();
    const info = await admin.ping();
    res.json({ status: "MongoDB is alive", info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to ping MongoDB" });
  }
});

module.exports = app;
