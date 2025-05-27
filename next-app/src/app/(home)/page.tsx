'use client';

import { useState } from 'react';
import Confetti from 'react-confetti-boom';
import StatusComponent from '@/components/StatusComponent';
import TableForm from '@/components/TableForm';
import LoadingComponent from '@/components/LoadingComponent';
import { useAppMachine } from '@/hooks/useAppMachine';
import { useUpdatePartyStatus } from '@/hooks/useUpdatePartyStatus';
import { useJoinQueueMutation } from '@/hooks/useJoinQueueMutation';
import { useUUID } from '@/context/UUIDContext';
import { Typography, Divider, Button, Box } from '@mui/material';
import DevPanel from '@/components/DevPanel';
// import { usePingDB } from '@/hooks/usePingDB';

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

  const { uuid, removeUUID, resetUUID } = useUUID();

  const current = currentState as AppState;

  // const { data } = usePingDB();

  const {
    updatePartyStatus,
    loading: patchLoading,
    error: patchError,
  } = useUpdatePartyStatus();

  const [joinedPartyID, setJoinedPartyID] = useState<string>('000');
  // const [totalSeats, setTotalSeats] = useState<number>(10);
  // const [availableSeats, setAvailableSeats] = useState<number | null>(null);

  const mutation = useJoinQueueMutation((data) => {
    setJoinedPartyID(data.id);
    queueJoined();
  });

  // Update state whenever data changes
  // useEffect(() => {
  //   if (data?.system?.[0]) {
  //     setTotalSeats(data.system[0].totalSeats);
  //     setAvailableSeats(data.system[0].availableSeats);
  //   }
  // }, [data]);

  return (
    <>
      {/* Check DB Connection */}
      <DevPanel joinedPartyID={joinedPartyID} patchError={patchError} />

      {current === 'formSubmitted' ? (
        <Box textAlign="center" mt={4}>
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
                onClick={() => updatePartyStatus(uuid, 'seated')}
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
                onClick={() => updatePartyStatus(uuid, 'done')}
                disabled={patchLoading}
              >
                Mark as Done
              </Button>
              {/* dev button reset */}
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
                onClick={() => {
                  reset();
                  removeUUID();
                  resetUUID();
                }}
              >
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

            {current === 'showForm' && (
              <TableForm
                onSubmit={(data) => {
                  const payload = {
                    uuid,
                    name: data.name,
                    size: data.size,
                    status: 'waiting',
                  };

                  submitForm();
                  mutation.mutate(payload);
                }}
                isLoading={mutation.status === 'pending'}
              />
            )}

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
          </div>
        </>
      )}
    </>
  );
}
