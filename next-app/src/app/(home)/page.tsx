'use client';

import { useState, useEffect, useMemo } from 'react';
// libs
import Confetti from 'react-confetti-boom';
import { Box, Button, Divider, Typography } from '@mui/material';
// components
import DevPanel from '@/components/DevPanel';
import StatusComponent from '@/components/StatusComponent';
import TableForm from '@/components/TableForm';
import LoadingComponent from '@/components/LoadingComponent';
// helpers
import { calculateWaitEstimate } from '@/helpers/calculateWaitEstimate';
// hooks
import { useAppMachine } from '@/hooks/useAppMachine';
import { useUpdatePartyStatus } from '@/hooks/useUpdatePartyStatus';
import { useJoinQueueMutation } from '@/hooks/useJoinQueueMutation';
import { usePingDB } from '@/hooks/usePingDB';
import { useParty } from '@/hooks/useParty';
// context
import { useUUID } from '@/context/UUIDContext';
// types
import type { AppState } from '@/types/appState';

export default function HomePage() {
  const {
    currentState,
    joinQueue,
    submitForm,
    queueJoined,
    leaveQueue,
    readyToCheckIn,
    checkedIn,
    reset,
    forceInQueue,
  } = useAppMachine();
  const current = currentState as AppState;

  const { uuid, removeUUID, resetUUID } = useUUID();
  const { party, loading: partyLoading, error: partyError } = useParty(uuid);
  const { data: pingData } = usePingDB();
  const {
    updatePartyStatus,
    loading: patchLoading,
    error: patchError,
  } = useUpdatePartyStatus();

  // local state
  const [totalSeats, setTotalSeats] = useState(0);
  const [availableSeats, setAvailableSeats] = useState<number | null>(null);
  const [nextPartyId, setNextPartyId] = useState('000');
  const [nextPartySize, setNextPartySize] = useState<number | null>(null);
  const [joinedPartyID, setJoinedPartyID] = useState<string>('000');

  // details for this session
  const [customerName, setCustomerName] = useState<string>('');
  const [customerSize, setCustomerSize] = useState<number>(0);

  // helper booleans
  const isIdle = current === 'idle';
  const isShowForm = current === 'showForm';
  const isInQueue = current === 'inQueue';
  const isReadyToCheckIn = current === 'readyToCheckIn';
  const isCheckedIn = current === 'checkedIn';

  // wait time only changes when the nextPartyID changes, useMemo caches this calculation
  const waitEstimate = useMemo(
    () => calculateWaitEstimate(joinedPartyID, nextPartyId),
    [joinedPartyID, nextPartyId]
  );

  // When a UUID is the same, we need to force a user back to their previous state
  useEffect(() => {
    if (party && !partyLoading && !partyError) {
      if (party.status === 'waiting') {
        forceInQueue();
        setJoinedPartyID(party.partyID);
      }
    }
  }, [party, partyLoading, partyError, forceInQueue, reset]);

  // Move all values from System into state if pingData changes
  useEffect(() => {
    if (pingData?.system?.[0]) {
      const system = pingData.system[0];
      setTotalSeats(system.totalSeats);
      setAvailableSeats(system.availableSeats);
      setNextPartyId(system.nextPartyId);
      setNextPartySize(system.nextPartySize);
    }
  }, [pingData]);

  // Update the page when the user reaches the front of the queue
  useEffect(() => {
    if (isInQueue && joinedPartyID === nextPartyId) {
      readyToCheckIn();
    }
  }, [current, isInQueue, joinedPartyID, nextPartyId, readyToCheckIn]);

  // handler for custom mutation hook
  const mutation = useJoinQueueMutation((data) => {
    setJoinedPartyID(data.id);
    queueJoined();
  });

  // handle submit form button, but change state here
  const handleFormSubmit = (data: { name: string; size: number }) => {
    const payload = {
      uuid,
      name: data.name,
      size: data.size,
      status: 'waiting',
    };
    setCustomerSize(data.size);
    setCustomerName(data.name);
    submitForm();
    mutation.mutate(payload);
  };

  // handle buttons which update this parties state
  const handleStatusUpdate = (status: 'seated' | 'done') => {
    if (uuid) updatePartyStatus(uuid, status);
    checkedIn();
  };

  // handle premature queue leaving
  const handleLeaveQueue = () => {
    handleStatusUpdate('done');
    leaveQueue();
    removeUUID();
    resetUUID();
  };

  return (
    <>
      {/* Optional dev panel */}
      <DevPanel
        joinedPartyID={joinedPartyID}
        patchError={patchError}
        totalSeats={totalSeats}
        availableSeats={availableSeats}
        nextPartyId={nextPartyId}
        nextPartySize={nextPartySize}
        customerSize={customerSize}
      />

      {/* If user is in queue, or ready to check in we should display status */}
      {(isInQueue || isReadyToCheckIn) && (
        <StatusComponent
          state={current}
          name={customerName}
          partyID={joinedPartyID}
          nextPartyID={nextPartyId}
          estimateInMinutes={waitEstimate}
        />
      )}

      {/* If ready to check in, but not yet seated */}
      {isReadyToCheckIn && uuid && party?.status !== 'seated' && (
        <Button
          variant="outlined"
          onClick={() => handleStatusUpdate('seated')}
          disabled={patchLoading}
        >
          Check In
        </Button>
      )}

      {current == 'inQueue' && <Divider flexItem sx={{ my: 4 }} />}

      {/* bottom half of page */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={4}
        width="100%"
      >
        {isIdle && (
          <>
            <Typography variant="h3" component="p">
              {`Welcome to Uncle Joe's`}
            </Typography>
            <Typography variant="h4" component="p">
              Get in the queue?
            </Typography>
            <Button variant="outlined" onClick={joinQueue}>
              Join queue
            </Button>
          </>
        )}

        {isShowForm && (
          <TableForm
            onSubmit={handleFormSubmit}
            isLoading={mutation.status === 'pending'}
          />
        )}

        {isInQueue && (
          <>
            <LoadingComponent text="Waiting" withDots />
            <Box display="flex" gap={4} alignItems="center">
              <Typography variant="h5">Change your mind?</Typography>
              {/* Option to leave queue */}
              <Button
                variant="outlined"
                color="warning"
                onClick={handleLeaveQueue}
              >
                Leave Queue
              </Button>
            </Box>
          </>
        )}

        {/* celebration confetti */}
        {isReadyToCheckIn && (
          <Confetti
            particleCount={80}
            effectCount={10}
            colors={['#7935D2', '#292929']}
            shapeSize={15}
            spreadDeg={90}
            y={0.8}
          />
        )}

        {/* Final state - thank you */}
        {isCheckedIn && (
          <>
            <Typography variant="h3" component="p">
              {`Thanks for visiting Uncle Joe's,`}
            </Typography>
            <Typography variant="h4" component="p">
              See you soon.
            </Typography>
          </>
        )}
      </Box>
    </>
  );
}
