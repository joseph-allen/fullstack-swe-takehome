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

  const padded = String(result.value.seq).padStart(3, "0");
  return padded;
}

async function main() {
  await client.connect();
  const db = client.db("my-db");

  // Ensure collections exist
  await db.createCollection("parties").catch(() => {});
  await db.createCollection("system").catch(() => {});

  // Set up system singleton
  await db.collection("system").updateOne(
    { _id: "singleton" },
    {
      $setOnInsert: {
        totalSeats: 10,
        availableSeats: 10,
      },
    },
    { upsert: true }
  );

  // Clear previous parties
  await db.collection("parties").deleteMany({});

  // Reset counter
  await db
    .collection("counters")
    .updateOne({ _id: "partyID" }, { $set: { seq: 0 } }, { upsert: true });

  // Insert sample data
  const parties = [
    {
      uuid: "uuid-1",
      name: "Alice",
      size: 2,
      status: "waiting",
      createdAt: new Date(),
    },
    {
      uuid: "uuid-2",
      name: "Bob",
      size: 4,
      status: "seated",
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      seatedAt: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      uuid: "uuid-3",
      name: "Charlie",
      size: 2,
      status: "done",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      seatedAt: new Date(Date.now() - 27 * 60 * 1000),
    },
  ];

  for (const party of parties) {
    // TODO: This should get an auto-incrementing party id
    // party.partyID = await getNextPartyID(db);
    await db.collection("parties").insertOne(party);
  }

  console.log("Database initialised with auto-incremented partyIDs");
  await client.close();
}

main().catch(console.error);
