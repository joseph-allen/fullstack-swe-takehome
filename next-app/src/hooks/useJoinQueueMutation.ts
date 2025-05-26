import { useMutation } from '@tanstack/react-query';
import { TableFormValues } from '@/types/tableForm';

export function useJoinQueueMutation(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async (data: TableFormValues) => {
      const res = await fetch('/api/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to join queue');
      return res.json();
    },
    onSuccess,
  });
}
