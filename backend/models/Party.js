const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  partyID: { type: String, default: "000" },
  status: {
    type: String,
    enum: ["waiting", "seated", "done"],
    default: "waiting",
  },
});

module.exports = mongoose.model("Party", partySchema);
