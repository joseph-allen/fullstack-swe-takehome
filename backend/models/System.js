const mongoose = require("mongoose");

// we explicitly set system as the collection here to support existing API
const systemSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: "singleton",
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    nextPartyId: {
      type: String,
      default: null,
    },
    nextPartySize: {
      type: Number,
      default: null,
    },
  },
  { collection: "system" }
);

module.exports = mongoose.model("System", systemSchema);
