export type PartyRequestPayload = {
  uuid: string;
  name: string;
  size: number;
  status: 'waiting' | 'seated' | 'cancelled'; // You can adjust this union as needed
};

export type JoinQueueResponse = {
  message: string;
  id: string;
};
