const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  partyID: { type: String, default: "101" }, // Set default or assign later
});

module.exports = mongoose.model("Party", partySchema);
