const { MongoClient } = require("mongodb");
const partiesData = require("./parties/full-resturant-no-queue.json");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const TOTAL_SEATS = 10;

async function getNextPartyID(db) {
  const result = await db
    .collection("counters")
    .findOneAndUpdate(
      { _id: "partyID" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    );
  return String(result.value.seq).padStart(3, "0");
}

async function prepareCollections(db) {
  // check collections exist before creating, they shouldn't
  const existingCollections = await db.listCollections().toArray();
  const existingNames = existingCollections.map((c) => c.name);

  // create collections by name
  const requiredCollections = ["parties", "system", "counters"];

  // For collection name, if it doesn't already exist, create a new collection
  for (const collName of requiredCollections) {
    if (!existingNames.includes(collName)) {
      await db.createCollection(collName);
    }
  }
}

async function main() {
  await client.connect();
  const db = client.db("my-db");

  await prepareCollections(db);

  // Reset parties and counters for "new day"
  // create new partyID counter, set to 0
  await Promise.all([
    db.collection("parties").deleteMany({}),
    db
      .collection("counters")
      .updateOne({ _id: "partyID" }, { $set: { seq: 0 } }, { upsert: true }),
  ]);

  // Convert date strings to the time now, for recent guests
  const parties = partiesData.map((party) => ({
    ...party,
    createdAt: party.createdAt ? new Date(party.createdAt) : new Date(),
    seatedAt: party.status === "seated" ? new Date() : null,
  }));

  // Insert parties with generated partyID
  for (const party of parties) {
    party.partyID = await getNextPartyID(db);
    await db.collection("parties").insertOne(party);
  }

  // Calculate available seats
  const seatedParties = await db
    .collection("parties")
    .find({ status: "seated" })
    .toArray();

  // calculate size of all seated parties
  const occupiedSeats = seatedParties.reduce(
    (sum, p) => sum + (p.size || 0),
    0
  );

  const availableSeats = TOTAL_SEATS - occupiedSeats;

  // Find next waiting party less than or equal to availible seats,
  // oldest first(Queue),
  // tie-break by higher partyID
  // return a single document, even though more shouldn't be possible
  const nextParty = await db
    .collection("parties")
    .find({ status: "waiting", size: { $lte: availableSeats } })
    .sort({ createdAt: 1, partyID: -1 })
    .limit(1)
    .next();

  // Initialise System collection
  await db.collection("system").updateOne(
    { _id: "singleton" }, // only one document
    {
      $set: {
        totalSeats: TOTAL_SEATS,
        availableSeats,
        nextPartyId: nextParty?.partyID || null,
        nextPartySize: nextParty?.size || null,
      },
    },
    { upsert: true }
  );

  await client.close();
}

main().catch(console.error);
