'use client';

import { useClientUUID } from '@/hooks/useClientUUID';

export default function UUIDComponent() {
  const { uuid, removeUUID, resetUUID } = useClientUUID();

  if (!uuid) return <p>Loading UUID...</p>;

  return (
    <>
      <p>Your UUID: {uuid}</p>
      <button onClick={removeUUID}>Clear UUID</button>
      <button onClick={resetUUID} style={{ marginLeft: '10px' }}>
        Reset UUID
      </button>
    </>
  );
}
