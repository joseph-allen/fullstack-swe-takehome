const request = require("supertest");
const express = require("express");
const partiesRouter = require("../../routes/parties"); // adjust path if needed
const Party = require("../../models/Party");
const getNextPartyID = require("../../helpers/getNextPartyID");

// Create an Express app with your router mounted
const app = express();
app.use(express.json());
app.use("/parties", partiesRouter);

jest.mock("../../models/Party");
jest.mock("../../helpers/getNextPartyID");

describe("Parties routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /parties", () => {
    it("should return list of parties", async () => {
      const fakeParties = [
        { uuid: "1", name: "Party A", size: 10, _id: "mongoid1" },
      ];
      // Mock Party.find() to resolve with fakeParties
      Party.find.mockResolvedValue(fakeParties);

      const response = await request(app).get("/parties");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(fakeParties);
      expect(Party.find).toHaveBeenCalled();
    });

    it("should return 500 on error", async () => {
      Party.find.mockRejectedValue(new Error("DB error"));

      const response = await request(app).get("/parties");

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ error: "Failed to fetch parties" });
    });
  });

  describe("POST /parties", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    it("should create a party successfully", async () => {
      const newParty = { uuid: "abc", name: "Test Party", size: 5 };
      getNextPartyID.mockResolvedValue("042");

      // Mock Party constructor to return an object with save method
      Party.mockImplementation(function (data) {
        this.uuid = data.uuid;
        this.name = data.name;
        this.size = data.size;
        this.createdAt = data.createdAt;
        this.partyID = data.partyID;
        this.save = jest.fn().mockResolvedValue(this);
      });

      const response = await request(app).post("/parties").send(newParty);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ message: "Party created", id: "042" });

      expect(getNextPartyID).toHaveBeenCalled();
      expect(Party).toHaveBeenCalledWith({
        ...newParty,
        createdAt: expect.any(Date),
        partyID: "042",
      });
      // Ensure save was called
      expect(Party.mock.instances[0].save).toHaveBeenCalled();
    });

    it("should return 400 if missing fields", async () => {
      const incompleteParty = { name: "No UUID" };

      const response = await request(app)
        .post("/parties")
        .send(incompleteParty);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error", "Missing required fields");
      expect(getNextPartyID).not.toHaveBeenCalled();
      expect(Party).not.toHaveBeenCalled();
    });

    it("should return 500 on DB failure", async () => {
      // missing a required field to trigger error
      const party = { uuid: "test-uuid", name: "Test Party", size: 5 };
      getNextPartyID.mockResolvedValue("999");

      Party.mockImplementation(function (data) {
        this.save = jest.fn().mockRejectedValue(new Error("DB error"));
      });

      const response = await request(app).post("/parties").send(party);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ error: "Failed to insert party" });
    });

    afterAll(() => {
      consoleErrorSpy.mockRestore();
    });
  });
});
