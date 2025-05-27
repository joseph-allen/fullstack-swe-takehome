async function getNextPartyID(db) {
  const result = await db
    .collection("counters")
    .findOneAndUpdate(
      { _id: "partyID" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    );

  if (!result.value || typeof result.value.seq !== "number") {
    throw new Error("Failed to generate next partyID");
  }

  return String(result.value.seq).padStart(3, "0");
}

module.exports = getNextPartyID;
