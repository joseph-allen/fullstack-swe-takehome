'use client';

import { useClientUUID } from '@/hooks/useClientUUID';

export default function UUIDComponent() {
  const { uuid, removeUUID } = useClientUUID();

  if (!uuid) return <p>Loading UUID...</p>;

  return (
    <>
      <p>Your UUID: {uuid}</p>
      <button onClick={removeUUID}>Clear UUID</button>
    </>
  );
}
