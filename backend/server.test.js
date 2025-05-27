const request = require("supertest");
const express = require("express");

// Create a minimal test app
function createTestApp(mockDb) {
  const app = express();

  // Inject mockDb into locals
  app.locals.db = mockDb;

  // Define route inline for isolated test
  app.get("/ping-db", async (req, res) => {
    try {
      const db = req.app.locals.db;
      const pingResult = await db.admin().ping();
      if (pingResult.ok !== 1) {
        return res.status(500).json({ status: "MongoDB ping failed" });
      }
      const systemData = await db.system.find({}).toArray();

      res.json({ status: "MongoDB is alive", system: systemData });
    } catch (error) {
      res.status(500).json({ status: "Error", error: error.message });
    }
  });

  return app;
}

describe("Express server basic routes", () => {
  it("GET /ping-db should return mocked MongoDB status", async () => {
    const mockPing = jest.fn().mockResolvedValue({ ok: 1 });

    const mockToArray = jest
      .fn()
      .mockResolvedValue([
        { _id: "singleton", availableSeats: 10, totalSeats: 10 },
      ]);

    const mockFind = jest.fn(() => ({
      toArray: mockToArray,
    }));

    const mockDb = {
      admin: () => ({
        ping: mockPing,
      }),
      system: {
        find: mockFind,
      },
    };

    const app = createTestApp(mockDb);

    const response = await request(app).get("/ping-db");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "MongoDB is alive");
    expect(response.body).toHaveProperty("system");
    expect(response.body.system[0]).toEqual({
      _id: "singleton",
      availableSeats: 10,
      totalSeats: 10,
    });
  });
});
