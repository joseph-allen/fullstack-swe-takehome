'use client';

import { Typography, Divider, Button, Box } from '@mui/material';
import Confetti from 'react-confetti-boom';
import StatusComponent from '@/components/StatusComponent';
import TableForm from '@/components/TableForm';
import LoadingComponent from '@/components/LoadingComponent';
import { useAppMachine } from '@/hooks/useAppMachine';
import { usePingDB } from '@/hooks/usePingDB';
import { useUpdatePartyStatus } from '@/hooks/useUpdatePartyStatus';
import { useJoinQueueMutation } from '@/hooks/useJoinQueueMutation';
import { useUUID } from '@/context/UUIDContext';
import { useState, useEffect } from 'react';

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
  } = useAppMachine();

  const { uuid, removeUUID } = useUUID();
  const current = currentState as AppState;
  const { data, error, isLoading } = usePingDB();
  const {
    updatePartyStatus,
    loading: patchLoading,
    error: patchError,
  } = useUpdatePartyStatus();

  const [joinedPartyID, setJoinedPartyID] = useState<string>('000');
  const [totalSeats, setTotalSeats] = useState<number | null>(null);
  const [availableSeats, setAvailableSeats] = useState<number | null>(null);

  const mutation = useJoinQueueMutation((data) => {
    setJoinedPartyID(data.id);
    queueJoined();
  });

  useEffect(() => {
    if (data?.system?.[0]) {
      setTotalSeats(data.system[0].totalSeats);
      setAvailableSeats(data.system[0].availableSeats);
    }
  }, [data]);

  return (
    <>
      {/* Check DB Connection   */}
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        {!uuid ? (
          <p>Loading UUID...</p>
        ) : (
          <>
            <p>Your UUID: {uuid}</p>
            <button onClick={removeUUID}>Clear UUID</button>
          </>
        )}
        {/* Display backend/MongoDB connection status */}
        {isLoading && <Typography>Checking backend connection...</Typography>}
        {error && (
          <Typography color="error">
            Backend error: {(error as Error).message}
          </Typography>
        )}
        {data && (
          <>
            <Typography color="success.main">Backend OK</Typography>
            {data.system?.[0] && (
              <div>
                <Typography>Total Seats: {totalSeats}</Typography>
                <Typography>Available Seats: {availableSeats}</Typography>
              </div>
            )}
          </>
        )}
        {joinedPartyID && (
          <Typography>
            Assigned partyID: <strong>{joinedPartyID}</strong>
          </Typography>
        )}
        {patchError && (
          <Typography color="error" mt={2}>
            Error updating status: {patchError}
          </Typography>
        )}
      </div>

      {current === 'formSubmitted' ? (
        <Box textAlign="center" mt={4}>
          <LoadingComponent text="Joining Queue" withDots />
          <Button
            variant="outlined"
            color="error"
            onClick={queueJoined}
            sx={{ mt: 2 }}
          >
            Skip wait (dev button)
          </Button>
        </Box>
      ) : (
        <>
          <div>
            <StatusComponent
              state={current}
              estimateInMinutes={45}
              name="The Smiths"
              partyID={joinedPartyID}
            />
          </div>

          {/* TODO: To be removed later */}
          {current === 'readyToCheckIn' && uuid && (
            <Box mt={2} display="flex" gap={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => updatePartyStatus(uuid, 'seated')}
                disabled={patchLoading}
              >
                Mark as Seated
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => updatePartyStatus(uuid, 'done')}
                disabled={patchLoading}
              >
                Mark as Done
              </Button>
              {/* dev button reset */}
              <Button variant="outlined" color="warning" onClick={reset}>
                Reset
              </Button>
            </Box>
          )}

          {current !== 'readyToCheckIn' && <Divider flexItem />}

          <div
            style={{
              display: 'flex',
              height: '100%',
              width: '100%',
              flexDirection: 'column',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            {current === 'idle' && (
              <>
                <Typography variant="h5">Get in the queue?</Typography>
                <Button variant="outlined" onClick={joinQueue}>
                  Join queue
                </Button>
              </>
            )}

            {/* Pass in UUID here */}
            {current === 'showForm' && (
              <TableForm
                onSubmit={(data) => {
                  const payload = {
                    uuid,
                    name: data.name,
                    size: data.size,
                    status: 'waiting',
                  };

                  // Move to formSubmitted state immediately
                  submitForm();

                  // Fire the mutation
                  mutation.mutate(payload);
                }}
                isLoading={mutation.status === 'pending'}
              />
            )}

            {/* TODO: If UUID already is in queue, route to this page */}
            {current === 'inQueue' && (
              <>
                <LoadingComponent text="You're in the queue" withDots />
                <div style={{ display: 'flex', gap: 32 }}>
                  <Typography variant="h5">Change your mind?</Typography>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={leaveQueue}
                  >
                    Leave Queue
                  </Button>
                </div>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={readyToCheckIn}
                  style={{ marginTop: '16px' }}
                >
                  Ready to Check In (dev button)
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
          </div>
        </>
      )}
    </>
  );
}
