import { createMachine } from 'xstate';

export const appMachine = createMachine({
  id: 'queue',
  initial: 'idle',
  states: {
    idle: {
      on: {
        JOIN_CLICKED: 'showForm',
        FORCE_INQUEUE: 'inQueue',
        FORCE_READY: 'readyToCheckIn',
      },
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
      on: {
        CHECKED_IN: 'checkedIn',
      },
    },
    checkedIn: {
      type: 'final',
    },
  },
});
