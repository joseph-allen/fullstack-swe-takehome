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
    checkedIn: () => send({ type: 'CHECKED_IN' }),
    reset: () => send({ type: 'RESET' }),
    forceInQueue: () => send({ type: 'FORCE_INQUEUE' }),
    forceCheckedIn: () => send({ type: 'FORCE_CHECKED_IN' }),
  };
}
