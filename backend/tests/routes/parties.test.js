const request = require("supertest");
const express = require("express");
const partiesRouter = require("../../routes/parties"); // adjust path if needed
const Party = require("../../models/Party");
const getNextPartyID = require("../../helpers/getNextPartyID");

// Mock mongoose connection and db collection for PATCH route
const mongoose = require("mongoose");

jest.mock("../../models/Party");
jest.mock("../../helpers/getNextPartyID");

// Mock collection for 'system' used in patch route
const mockSystemCollection = {
  findOne: jest.fn(),
  updateOne: jest.fn(),
};

// Mock mongoose connection db collection method
mongoose.connection = {
  db: {
    collection: jest.fn(() => mockSystemCollection),
  },
};

const app = express();
app.use(express.json());
app.use("/parties", partiesRouter);

describe("Parties routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /parties", () => {
    it("should return list of parties", async () => {
      const fakeParties = [
        { uuid: "1", name: "Party A", size: 10, _id: "mongoid1" },
      ];
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

      Party.mockImplementation(function (data) {
        this.uuid = data.uuid;
        this.name = data.name;
        this.size = data.size;
        this.createdAt = data.createdAt;
        this.status = data.status;
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
        status: "waiting",
        partyID: "042",
      });
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

  describe("PATCH /parties/:uuid", () => {
    it("returns 400 if newStatus is missing or invalid", async () => {
      const res = await request(app).patch("/parties/test-uuid").send({}); // no newStatus

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: "Invalid or missing newStatus" });

      const resInvalid = await request(app)
        .patch("/parties/test-uuid")
        .send({ newStatus: "invalid" });

      expect(resInvalid.statusCode).toBe(400);
      expect(resInvalid.body).toEqual({
        error: "Invalid or missing newStatus",
      });
    });

    it("returns 404 if party not found", async () => {
      Party.findOne.mockResolvedValue(null);

      const res = await request(app)
        .patch("/parties/nonexistent-uuid")
        .send({ newStatus: "seated" });

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: "Party not found" });
      expect(Party.findOne).toHaveBeenCalledWith({ uuid: "nonexistent-uuid" });
    });

    it("returns 400 on invalid status transition", async () => {
      // transitioning from done to waiting is backwards, and invalid
      Party.findOne.mockResolvedValue({
        uuid: "test-uuid",
        status: "done",
        size: 2,
      });

      const res = await request(app)
        .patch("/parties/test-uuid")
        .send({ newStatus: "waiting" });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/Invalid status transition/);
    });
  });
});
