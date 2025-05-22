'use client';

import { Typography, Divider, Button, Box } from '@mui/material';
import Confetti from 'react-confetti-boom';
import StatusComponent from '@/components/StatusComponent';
import TableForm from '@/components/TableForm';
import LoadingComponent from '@/components/LoadingComponent';
import UUIDComponent from '@/components/UUIDComponent';
import { useAppMachine } from '@/hooks/useAppMachine';
import { usePingDB } from '@/hooks/usePingDB';

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

  const current = currentState as AppState;
  const { data, error, isLoading } = usePingDB();

  return (
    <>
      {/* Set UUID   */}
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <UUIDComponent />
        {/* Display backend/MongoDB connection status */}
        {isLoading && <Typography>Checking backend connection...</Typography>}
        {error && (
          <Typography color="error">
            Backend error: {(error as Error).message}
          </Typography>
        )}
        {data && <Typography color="success.main">Backend OK</Typography>}
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
              partyID={123}
            />
          </div>

          {/* TODO: To be removed later */}
          {current === 'readyToCheckIn' && (
            <Button
              variant="outlined"
              color="error"
              onClick={reset}
              style={{ marginTop: '16px' }}
            >
              Reset (dev button)
            </Button>
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
                onSubmit={() => {
                  console.log('submit');
                  submitForm();
                }}
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
