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

  return String(result.seq).padStart(3, "0");
}

async function main() {
  await client.connect();
  const db = client.db("my-db");

  await db.createCollection("parties").catch(() => {});
  await db.createCollection("system").catch(() => {});
  await db.createCollection("counters").catch(() => {});

  await db.collection("parties").deleteMany({});
  await db
    .collection("counters")
    .updateOne({ _id: "partyID" }, { $set: { seq: 0 } }, { upsert: true });

  const TOTAL_SEATS = 10;

  const parties = [
    {
      uuid: "uuid-1",
      name: "Alice",
      size: 1,
      status: "seated",
      createdAt: new Date(),
      seatedAt: new Date(),
    },
    {
      uuid: "uuid-2",
      name: "Bob",
      size: 5,
      status: "seated",
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      seatedAt: new Date(),
    },
    {
      uuid: "uuid-3",
      name: "Charlie",
      size: 1,
      status: "seated",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      seatedAt: new Date(),
    },
    {
      uuid: "uuid-4",
      name: "Dana",
      size: 2,
      status: "waiting",
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
      seatedAt: null,
    },
    {
      uuid: "uuid-5",
      name: "Eli",
      size: 4,
      status: "waiting",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      seatedAt: null,
    },
  ];

  for (const party of parties) {
    party.partyID = await getNextPartyID(db);
    await db.collection("parties").insertOne(party);
  }

  const seatedParties = await db
    .collection("parties")
    .find({ status: "seated" })
    .toArray();
  const occupiedSeats = seatedParties.reduce(
    (sum, p) => sum + (p.size || 0),
    0
  );
  const availableSeats = TOTAL_SEATS - occupiedSeats;

  // Find the next party to be seated
  const nextParty = await db
    .collection("parties")
    .find({ status: "waiting", size: { $lte: availableSeats } })
    .sort({ createdAt: 1, partyID: -1 }) // oldest first, break ties by higher ID
    .limit(1)
    .next();

  const nextPartyId = nextParty?.partyID || null;
  const nextPartySize = nextParty?.size || null;

  await db.collection("system").updateOne(
    { _id: "singleton" },
    {
      $set: {
        totalSeats: TOTAL_SEATS,
        availableSeats,
        nextPartyId,
        nextPartySize,
      },
    },
    { upsert: true }
  );

  await client.close();
}

main().catch(console.error);
