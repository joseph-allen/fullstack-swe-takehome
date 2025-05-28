const Party = require("./models/Party");
const System = require("./models/System");

function startPartyStatusUpdater(db) {
  console.log("Restaurant Simulator ticking");

  setInterval(async () => {
    try {
      console.log("Running party status update check...");

      const now = new Date();

      // 1. Update seated -> done if time has elapsed
      const seatedParties = await Party.find({ status: "seated" });
      for (const party of seatedParties) {
        if (!party.seatedAt) continue;

        const elapsedMs = now - party.seatedAt;
        const requiredMs = party.size * 3000;

        if (elapsedMs >= requiredMs) {
          await Party.updateOne(
            { _id: party._id, status: "seated" },
            { $set: { status: "done" } }
          );
          await db
            .collection("system")
            .updateOne(
              { _id: "singleton" },
              { $inc: { availableSeats: party.size } }
            );
          console.log(`Freed ${party.size} seats from ${party.name}`);
        }
      }

      // 2. Try to seat next simulated party if possible
      const system = await System.findById("singleton");
      const nextPartyId = system.nextPartyId;
      const nextPartySize = system.nextPartySize;

      if (
        nextPartyId &&
        nextPartySize &&
        system.availableSeats >= nextPartySize
      ) {
        const nextParty = await Party.findOne({
          partyID: nextPartyId,
          status: "waiting",
          simulatedParty: true,
        });

        if (nextParty) {
          // Seat the party as usual
          await Party.updateOne(
            { _id: nextParty._id, status: "waiting" },
            { $set: { status: "seated", seatedAt: new Date() } }
          );

          // Clear the current nextParty pointer
          await System.updateOne(
            { _id: "singleton" },
            {
              $inc: { availableSeats: -nextParty.size },
              $set: { nextPartyId: null, nextPartySize: null },
            }
          );

          // Immediately find the next waiting party and update the system doc
          const nextWaitingParty = await Party.findOne({
            status: "waiting",
            simulatedParty: true,
          }).sort({ partyID: 1 });

          if (nextWaitingParty) {
            await System.updateOne(
              { _id: "singleton" },
              {
                $set: {
                  nextPartyId: nextWaitingParty.partyID,
                  nextPartySize: nextWaitingParty.size,
                },
              }
            );
          }
        }
      }
    } catch (err) {
      console.error("Error in party status updater:", err);
    }
  }, 3000);
}

module.exports = startPartyStatusUpdater;
