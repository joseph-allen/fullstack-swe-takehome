const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function getNextPartyID(db) {
  const result = await db
    .collection("counters")
    .findOneAndUpdate(
      { _id: "partyID" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    );

  // For padded strings
  const padded = String(result.seq).padStart(3, "0");
  return padded;
}

async function main() {
  await client.connect();
  const db = client.db("my-db");

  // Ensure collections exist
  await db.createCollection("parties").catch(() => {});
  await db.createCollection("system").catch(() => {});
  await db.createCollection("counters").catch(() => {});

  // Clear previous data
  await db.collection("parties").deleteMany({});
  await db
    .collection("counters")
    .updateOne({ _id: "partyID" }, { $set: { seq: 0 } }, { upsert: true });

  const TOTAL_SEATS = 10;

  // Insert sample data
  const parties = [
    {
      uuid: "uuid-1",
      name: "Alice",
      size: 2,
      status: "seated",
      createdAt: new Date(),
    },
    {
      uuid: "uuid-2",
      name: "Bob",
      size: 6,
      status: "seated",
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      seatedAt: new Date(),
    },
    {
      uuid: "uuid-3",
      name: "Charlie",
      size: 2,
      status: "seated",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      seatedAt: new Date(),
    },
  ];

  for (const party of parties) {
    party.partyID = await getNextPartyID(db);
    await db.collection("parties").insertOne(party);
  }

  // Calculate current occupied seats
  const seatedParties = await db
    .collection("parties")
    .find({ status: "seated" })
    .toArray();
  const occupiedSeats = seatedParties.reduce(
    (sum, p) => sum + (p.size || 0),
    0
  );
  const availableSeats = TOTAL_SEATS - occupiedSeats;

  // Update system singleton after party insertion
  await db.collection("system").updateOne(
    { _id: "singleton" },
    {
      $set: {
        totalSeats: TOTAL_SEATS,
        availableSeats,
      },
    },
    { upsert: true }
  );

  await client.close();
}

main().catch(console.error);
