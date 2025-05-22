// init.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function main() {
  await client.connect();
  const db = client.db("my-db");

  // Collections
  await db.createCollection("parties");
  await db.createCollection("system");

  // System defaults
  await db.collection("system").updateOne(
    {},
    {
      $setOnInsert: {
        totalSeats: 10,
        availableSeats: 10,
      },
    },
    { upsert: true }
  );

  console.log("DB initialised");
  await client.close();
}

main().catch(console.error);
