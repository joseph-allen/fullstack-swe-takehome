// file to handle seperate simulation logic, could be removed in prod
const Party = require("./models/Party");
// const mongoose = require("mongoose");

function startPartyStatusUpdater(db) {
  console.log("Resturant Simulator ticking");
  const systemColl = db.collection("system");

  setInterval(() => {
    (async () => {
      try {
        console.log("Running party status update check...");
        const now = new Date();
        const seatedParties = await Party.find({ status: "seated" });

        for (const party of seatedParties) {
          // skip anyone who isn't seated
          if (!party.seatedAt) {
            continue;
          }

          const elapsedMs = now - party.seatedAt;
          const requiredMs = party.size * 3000;

          if (elapsedMs >= requiredMs) {
            const updateRes = await Party.updateOne(
              { _id: party._id, status: "seated" },
              { $set: { status: "done" } }
            );
            const seatUpdateRes = await systemColl.updateOne(
              { _id: "singleton" },
              { $inc: { availableSeats: party.size } }
            );
            console.log(
              `Freed ${party.size} seats for ${party.name}:`,
              seatUpdateRes
            );
          }
        }
      } catch (err) {
        console.error("Error in party status updater:", err);
      }
    })();
  }, 3000);
}

module.exports = startPartyStatusUpdater;
