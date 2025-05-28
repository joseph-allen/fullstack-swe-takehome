const mongoose = require("mongoose");
const Party = require("../models/Party");
const System = require("../models/System");
const calculateAvailableSeats = require("../helpers/calculateAvailibleSeats");

async function updateSystemState() {
  const waiting = await Party.find({ status: "waiting" }).sort({ partyID: 1 });
  const nextParty = waiting[0] || null;
  const totalSeats = 10;
  const availableSeats = await calculateAvailableSeats(totalSeats);

  const systemState = {
    availableSeats,
    totalSeats,
    nextPartyId: nextParty?.partyID || null,
    nextPartySize: nextParty?.size || null,
  };

  // Singleton update using known ID
  console.log("Updating system state with:", systemState);
  const res = await System.updateOne(
    { _id: "singleton" },
    { $set: systemState },
    { upsert: true }
  );

  return systemState;
}

module.exports = updateSystemState;
