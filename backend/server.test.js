const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");

// Import your app setup without starting the server
// To do this, refactor your original file to export app without app.listen()
// But for minimal example, we'll recreate the routes here:

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Express backend!");
});

// Mock /ping-db route to avoid real DB calls
app.get("/ping-db", async (req, res) => {
  try {
    // Mocking admin.ping() response:
    const info = { ok: 1 };
    res.json({ status: "MongoDB is alive", info });
  } catch (error) {
    res.status(500).json({ error: "Failed to ping MongoDB" });
  }
});

describe("Test Express server routes", () => {
  test("GET / should return greeting message", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Hello from Express backend!");
  });

  test("GET /ping-db should return MongoDB status", async () => {
    const response = await request(app).get("/ping-db");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "MongoDB is alive");
    expect(response.body).toHaveProperty("info");
  });
});
