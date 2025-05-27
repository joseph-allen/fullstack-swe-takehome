const getNextPartyID = require("../../helpers/getNextPartyID");

describe("getNextPartyID", () => {
  let mockDb;
  let mockCollection;
  let mockFindOneAndUpdate;

  beforeEach(() => {
    mockFindOneAndUpdate = jest.fn();

    mockCollection = jest.fn(() => ({
      findOneAndUpdate: mockFindOneAndUpdate,
    }));

    mockDb = {
      collection: mockCollection,
    };
  });

  it("should return the next party ID as a 3-digit string", async () => {
    mockFindOneAndUpdate.mockResolvedValue({
      value: { seq: 7 },
    });

    const result = await getNextPartyID(mockDb);
    expect(result).toBe("007");

    expect(mockDb.collection).toHaveBeenCalledWith("counters");
    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      { _id: "partyID" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    );
  });

  it("should throw an error if result.value is missing", async () => {
    mockFindOneAndUpdate.mockResolvedValue({ value: null });

    await expect(getNextPartyID(mockDb)).rejects.toThrow(
      "Failed to generate next partyID"
    );
  });

  it("should throw an error if result.value.seq is not a number", async () => {
    mockFindOneAndUpdate.mockResolvedValue({ value: { seq: "not-a-number" } });

    await expect(getNextPartyID(mockDb)).rejects.toThrow(
      "Failed to generate next partyID"
    );
  });
});
