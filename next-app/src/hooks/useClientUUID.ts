'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useClientUUID = () => {
  const [uuid, setUUID] = useState<string | null>(null);

  useEffect(() => {
    // Only run on the client
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('user-uuid');
      if (existing) {
        setUUID(existing);
      } else {
        const newUUID = uuidv4();
        localStorage.setItem('user-uuid', newUUID);
        setUUID(newUUID);
      }
    }
  }, []);

  return uuid;
};
