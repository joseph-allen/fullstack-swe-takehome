export default function renderSeats(
  total: number,
  available: number,
  partySize: number
) {
  const filled = total - available;
  const numParty = Math.min(partySize, filled);
  const numOther = filled - numParty;

  let seatStr = '';
  for (let i = 0; i < total; i++) {
    if (i < numParty) {
      seatStr += '🟢'; // matrix green square for "current party"
    } else if (i < numParty + numOther) {
      seatStr += '🟩'; // other seated parties
    } else {
      seatStr += '⬛'; // empty seat
    }
  }
  return seatStr;
}
