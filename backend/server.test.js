const request = require("supertest");
const app = require("./server");

describe("Express server basic routes", () => {
  it("GET / should return greeting message", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Hello from Express backend!");
  });

  it("GET /ping-db should return mocked MongoDB status", async () => {
    const mockPing = jest.fn().mockResolvedValue({ ok: 1 });

    // Inject mocked db into app.locals
    app.locals.db = {
      admin: () => ({
        ping: mockPing,
      }),
    };

    const response = await request(app).get("/ping-db");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "MongoDB is alive");
  });
});
