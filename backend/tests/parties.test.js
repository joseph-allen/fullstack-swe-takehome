const request = require("supertest");
const app = require("../server");

describe("Parties routes", () => {
  const mockCollection = {
    find: jest.fn(),
    insertOne: jest.fn(),
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Inject mock db with collection method into app.locals
    app.locals.db = {
      collection: jest.fn(() => mockCollection),
    };
  });

  it("GET /parties should return list of parties", async () => {
    const fakeParties = [{ uuid: "1", name: "Party A", size: 10 }];
    mockCollection.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue(fakeParties),
    });

    const response = await request(app).get("/parties");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(fakeParties);
    expect(app.locals.db.collection).toHaveBeenCalledWith("parties");
    expect(mockCollection.find).toHaveBeenCalled();
  });

  it("POST /parties should create a party successfully", async () => {
    const newParty = { uuid: "abc", name: "Test Party", size: 5 };
    mockCollection.insertOne.mockResolvedValue({ insertedId: "mockedId123" });

    const response = await request(app).post("/parties").send(newParty);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      message: "Party created",
      id: "mockedId123",
    });
    expect(app.locals.db.collection).toHaveBeenCalledWith("parties");
    expect(mockCollection.insertOne).toHaveBeenCalledWith(newParty);
  });

  it("POST /parties should return 400 if missing fields", async () => {
    const incompleteParty = { name: "No UUID" };

    const response = await request(app).post("/parties").send(incompleteParty);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Missing required fields");
    expect(mockCollection.insertOne).not.toHaveBeenCalled();
  });

  it("POST /parties should return 500 on DB failure", async () => {
    const party = { uuid: "test-uuid", name: "Test Party", size: 5 };

    mockCollection.insertOne.mockRejectedValue(new Error("DB error"));

    // Temporarily mock console.error to suppress error logging during test
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await request(app).post("/parties").send(party);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Failed to insert party" });

    // Restore console.error after the test
    consoleErrorSpy.mockRestore();
  });
});
