export type PartyRequestPayload = {
  uuid: string;
  name: string;
  size: number;
  status: 'waiting' | 'seated' | 'cancelled';
  simulatedParty?: boolean;
};

export type JoinQueueResponse = {
  message: string;
  id: string;
};
