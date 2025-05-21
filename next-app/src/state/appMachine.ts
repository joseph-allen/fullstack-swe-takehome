import { createMachine } from 'xstate';

export const appMachine = createMachine({
  id: 'queue',
  initial: 'idle',
  states: {
    idle: {
      on: { JOIN_CLICKED: 'showForm' },
    },
    showForm: {
      on: { SUBMIT: 'formSubmitted' },
    },
    formSubmitted: {
      on: { QUEUE_JOINED: 'inQueue' },
    },
    inQueue: {
      on: {
        LEAVE: 'idle',
        READY: 'readyToCheckIn',
      },
    },
    readyToCheckIn: {
      // type: 'final' COMMENTED FOR DEBUGGING
      on: { RESET: 'idle' },
    },
  },
});
