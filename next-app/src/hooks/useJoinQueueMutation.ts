import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { TableFormValues } from '@/types/tableForm';

type JoinQueueResponse = {
  message: string;
  id: string;
};

export function useJoinQueueMutation(
  onSuccess?: (data: JoinQueueResponse) => void
): UseMutationResult<JoinQueueResponse, Error, TableFormValues> {
  return useMutation<JoinQueueResponse, Error, TableFormValues>({
    mutationFn: async (data: TableFormValues) => {
      const res = await fetch('/api/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to join queue');
      return res.json() as Promise<JoinQueueResponse>;
    },
    onSuccess,
  });
}
