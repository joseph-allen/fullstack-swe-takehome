import { useMachine } from '@xstate/react';
import { appMachine } from '@/state/appMachine';

export function useAppMachine() {
  const [state, send] = useMachine(appMachine);

  return {
    currentState: state.value,
    joinQueue: () => send({ type: 'JOIN_CLICKED' }),
    submitForm: () => send({ type: 'SUBMIT' }),
    queueJoined: () => send({ type: 'QUEUE_JOINED' }),
    leaveQueue: () => send({ type: 'LEAVE' }),
    readyToCheckIn: () => send({ type: 'READY' }),
    reset: () => send({ type: 'RESET' }),
  };
}
