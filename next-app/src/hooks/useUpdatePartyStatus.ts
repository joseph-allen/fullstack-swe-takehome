// hooks/useUpdatePartyStatus.ts

import { useState } from 'react';

type Status = 'seated' | 'done';

export function useUpdatePartyStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updatePartyStatus(uuid: string, status: Status) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/parties/${uuid}`, {
        // use uuid here
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus: status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      const updatedParty = await res.json();
      return updatedParty;
    } catch (error) {
      setError((error as Error).message);
      console.error('Error updating party status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { updatePartyStatus, loading, error };
}
