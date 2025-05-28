export function calculateWaitEstimate(
  partyID?: string,
  nextPartyID?: string
): number {
  if (!partyID || !nextPartyID) return 0;
  return Math.max(0, (parseInt(partyID) - parseInt(nextPartyID)) * 5);
}
