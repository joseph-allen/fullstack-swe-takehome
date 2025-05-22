'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const COOKIE_NAME = 'user-uuid';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/;`;
}

function deleteCookie(name: string) {
  // Set cookie with max-age=0 to expire immediately
  document.cookie = `${name}=; max-age=0; path=/;`;
}

export const useClientUUID = () => {
  const [uuid, setUUID] = useState<string | null>(null);

  useEffect(() => {
    // only run client-side
    if (typeof window !== 'undefined') {
      const existing = getCookie(COOKIE_NAME);
      if (existing) {
        setUUID(existing);
      } else {
        const newUUID = uuidv4();
        // Set timeout to 4 hours, roughly time between a late meal and an early one.
        // This could be resutrant dependent
        setCookie(COOKIE_NAME, newUUID, 4 * 60 * 60);
        setUUID(newUUID);
      }
    }
  }, []);

  const removeUUID = () => {
    deleteCookie(COOKIE_NAME);
    setUUID(null);
  };

  return { uuid, removeUUID };
};
