import { useQuery } from '@tanstack/react-query';

const fetchPing = async () => {
  const res = await fetch('/api/ping');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export function usePingDB() {
  return useQuery({
    queryKey: ['ping'],
    queryFn: fetchPing,
    staleTime: 10 * 1000,
    retry: 1,
  });
}
