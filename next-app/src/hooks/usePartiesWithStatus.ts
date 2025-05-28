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

export function usePartiesWithStatus(
  status: 'waiting' | 'seated' | 'done' | null
) {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === null) return;

    async function fetchParties() {
      setLoading(true);
      setError(null);
      try {
        const url = status ? `/api/parties?status=${status}` : '/api/parties';
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch parties: ${res.statusText}`);
        }
        const data = await res.json();
        setParties(data);
      } catch (error) {
        setError((error as Error).message);
        console.error('Error fetching parties with status:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchParties();
  }, [status]);

  return { parties, loading, error };
}
