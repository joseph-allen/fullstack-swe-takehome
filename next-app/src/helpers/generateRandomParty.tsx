import { PartyRequestPayload } from '@/types/partyRequest';

export function generateRandomParty(
  size: number,
  uuidPrefix: string = 'uuid'
): PartyRequestPayload {
  const id = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  return {
    uuid: `${uuidPrefix}-${id}`,
    name: `Rand${id}`,
    size,
    status: 'waiting',
  };
}
