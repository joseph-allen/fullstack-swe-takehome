import { useState, useEffect } from 'react';

interface Party {
  _id: string;
  uuid: string;
  partyID: string;
  name: string;
  size: number;
  status: 'waiting' | 'seated' | 'done';
  createdAt: string;
}

export function useParty(uuid: string | null) {
  const [party, setParty] = useState<Party | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uuid) return;

    async function fetchParty() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/parties/${uuid}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch party: ${res.statusText}`);
        }
        const data = await res.json();
        setParty(data);
      } catch (error) {
        setError((error as Error).message);
        console.error('Error updating party status:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    }

    fetchParty();
  }, [uuid]);

  return { party, loading, error };
}
