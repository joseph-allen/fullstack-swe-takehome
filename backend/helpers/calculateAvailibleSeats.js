const Party = require("../models/Party");

async function calculateAvailableSeats(totalSeats) {
  // Find all parties with status 'seated'
  const seatedParties = await Party.find({ status: "seated" });

  // Sum up their sizes
  const occupiedSeats = seatedParties.reduce(
    (sum, party) => sum + party.size,
    0
  );

  // Calculate available seats
  return totalSeats - occupiedSeats;
}

module.exports = calculateAvailableSeats;
