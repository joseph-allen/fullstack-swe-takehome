'use client';

import { useState, useEffect } from 'react';
import Confetti from 'react-confetti-boom';
import { Box, Button, Divider, Typography } from '@mui/material';

import DevPanel from '@/components/DevPanel';
import StatusComponent from '@/components/StatusComponent';
import TableForm from '@/components/TableForm';
import LoadingComponent from '@/components/LoadingComponent';

import { useAppMachine } from '@/hooks/useAppMachine';
import { useUpdatePartyStatus } from '@/hooks/useUpdatePartyStatus';
import { useJoinQueueMutation } from '@/hooks/useJoinQueueMutation';
import { usePingDB } from '@/hooks/usePingDB';
import { useParty } from '@/hooks/useParty';
import { useUUID } from '@/context/UUIDContext';

type AppState =
  | 'idle'
  | 'showForm'
  | 'formSubmitted'
  | 'inQueue'
  | 'readyToCheckIn';

export default function HomePage() {
  const {
    currentState,
    joinQueue,
    submitForm,
    queueJoined,
    leaveQueue,
    readyToCheckIn,
    reset,
    forceInQueue,
    forceReady,
  } = useAppMachine();

  const { uuid, removeUUID, resetUUID } = useUUID();
  const { party, loading: partyLoading, error: partyError } = useParty(uuid);

  const current = currentState as AppState;

  const { data: pingData } = usePingDB();

  const [totalSeats, setTotalSeats] = useState(0);
  const [availableSeats, setAvailableSeats] = useState<number | null>(null);
  const [nextPartyId, setNextPartyId] = useState('000');
  const [nextPartySize, setNextPartySize] = useState<number | null>(null);
  const [joinedPartyID, setJoinedPartyID] = useState<string>('000');

  // details for this session
  const [customerName, setCustomerName] = useState<string>('');
  const [customerSize, setCustomerSize] = useState<number>(0);

  const {
    updatePartyStatus,
    loading: patchLoading,
    error: patchError,
  } = useUpdatePartyStatus();

  function calculateWaitEstimate(
    partyID?: string,
    nextPartyID?: string
  ): number {
    if (!partyID || !nextPartyID) return 0;
    return Math.max(0, (parseInt(partyID) - parseInt(nextPartyID)) * 5);
  }

  useEffect(() => {
    if (party && !partyLoading && !partyError) {
      if (party.status === 'waiting') {
        forceInQueue();
        setJoinedPartyID(party.partyID);
      } else {
        // TODO: check this works once "ready to check in" works
        reset();
      }
    }
  }, [party, partyLoading, partyError, forceInQueue, forceReady, reset]);

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
    if (current === 'inQueue' && joinedPartyID === nextPartyId) {
      readyToCheckIn();
    }
  }, [current, joinedPartyID, nextPartyId, readyToCheckIn]);

  const mutation = useJoinQueueMutation((data) => {
    setJoinedPartyID(data.id);
    queueJoined();
  });

  const handleStatusUpdate = (status: 'seated' | 'done') => {
    if (uuid) updatePartyStatus(uuid, status);
  };

  const resetAll = () => {
    reset();
    removeUUID();
    resetUUID();
  };

  return (
    <>
      <DevPanel
        joinedPartyID={joinedPartyID}
        patchError={patchError}
        totalSeats={totalSeats}
        availableSeats={availableSeats}
        nextPartyId={nextPartyId}
        nextPartySize={nextPartySize}
        customerSize={customerSize}
      />

      {current === 'formSubmitted' && (
        <Box textAlign="center">
          <LoadingComponent text="Joining Queue" withDots />
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#00FF00',
              color: '#000',
              fontFamily: 'Courier New, monospace',
              '&:hover': {
                bgcolor: '#00CC00',
              },
            }}
            onClick={queueJoined}
          >
            Skip wait
          </Button>
        </Box>
      )}

      {(current === 'inQueue' || current === 'readyToCheckIn') && (
        <StatusComponent
          state={current}
          name={customerName}
          partyID={joinedPartyID}
          nextPartyID={nextPartyId}
          estimateInMinutes={calculateWaitEstimate(joinedPartyID, nextPartyId)}
        />
      )}

      {current === 'readyToCheckIn' && uuid && (
        <Box mt={2} display="flex" gap={2} justifyContent="center">
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#00FF00',
              color: '#000',
              fontFamily: 'Courier New, monospace',
              '&:hover': {
                bgcolor: '#00CC00',
              },
            }}
            onClick={() => handleStatusUpdate('seated')}
            disabled={patchLoading}
          >
            Mark as Seated
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#00FF00',
              color: '#000',
              fontFamily: 'Courier New, monospace',
              '&:hover': {
                bgcolor: '#00CC00',
              },
            }}
            onClick={() => handleStatusUpdate('done')}
            disabled={patchLoading}
          >
            Mark as Done
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#00FF00',
              color: '#000',
              fontFamily: 'Courier New, monospace',
              '&:hover': {
                bgcolor: '#00CC00',
              },
            }}
            onClick={resetAll}
          >
            Reset
          </Button>
        </Box>
      )}

      {current == 'inQueue' && <Divider flexItem sx={{ my: 4 }} />}

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={4}
        width="100%"
      >
        {current === 'idle' && (
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

        {current === 'showForm' && (
          <TableForm
            onSubmit={(data) => {
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
            }}
            isLoading={mutation.status === 'pending'}
          />
        )}

        {/* TODO: Change state when partyID matches NextPartyID  */}
        {current === 'inQueue' && (
          <>
            <LoadingComponent text="Waiting" withDots />
            <Box display="flex" gap={4} alignItems="center">
              <Typography variant="h5">Change your mind?</Typography>
              <Button variant="outlined" color="warning" onClick={leaveQueue}>
                Leave Queue
              </Button>
            </Box>
            <Button
              variant="contained"
              size="small"
              sx={{
                bgcolor: '#00FF00',
                color: '#000',
                fontFamily: 'Courier New, monospace',
                '&:hover': {
                  bgcolor: '#00CC00',
                },
              }}
              onClick={readyToCheckIn}
            >
              Ready to Check In
            </Button>
          </>
        )}

        {current === 'readyToCheckIn' && (
          <Confetti
            particleCount={80}
            effectCount={10}
            colors={['#7935D2', '#292929']}
            shapeSize={15}
            spreadDeg={90}
            y={0.8}
          />
        )}
      </Box>
    </>
  );
}
