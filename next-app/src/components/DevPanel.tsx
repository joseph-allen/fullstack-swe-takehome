'use client';

import { useState, useEffect } from 'react';
import {
  Drawer,
  Typography,
  Button,
  Box,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useUUID } from '@/context/UUIDContext';
import { usePingDB } from '@/hooks/usePingDB';
import renderSeats from '@/helpers/renderSeats';
import { usePartiesWithStatus } from '@/hooks/usePartiesWithStatus';
import { generateRandomParty } from '@/helpers/generateRandomParty';
import { useJoinQueueMutation } from '@/hooks/useJoinQueueMutation';

type DevPanelProps = {
  joinedPartyID: string;
  patchError: unknown;
  totalSeats: number;
  availableSeats: number | null;
  nextPartyId: string;
  nextPartySize: number | null;
  customerSize: number;
};

export default function DevPanel({
  joinedPartyID,
  patchError,
  totalSeats,
  availableSeats,
  nextPartyId,
  nextPartySize,
  customerSize,
}: DevPanelProps) {
  const { uuid, removeUUID } = useUUID();
  const { data, error, isLoading } = usePingDB();
  const { parties: waitingParties, refetch } = usePartiesWithStatus('waiting');

  const [open, setOpen] = useState(false);

  const canSeatNextParty =
    availableSeats !== null &&
    nextPartySize !== null &&
    availableSeats >= nextPartySize;

  const isUserNextParty = joinedPartyID === nextPartyId;

  const mutation = useJoinQueueMutation(() => {
    // I don't need any state to be updated for dev purposes.
    // pass
  });

  const addRandomParties = async () => {
    const randomSizes = [2, 3, 4, 5, 6];
    const numberOfParties = 1;

    // Wrap mutation.mutate in a Promise to await completion
    const promises = [];
    for (let i = 0; i < numberOfParties; i++) {
      const size = randomSizes[Math.floor(Math.random() * randomSizes.length)];
      const party = generateRandomParty(size);

      const promise = new Promise<void>((resolve, reject) => {
        mutation.mutate(party, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
      promises.push(promise);
    }
    await Promise.all(promises);

    // After all mutations finish, refresh parties
    if (refetch) {
      refetch();
    }
  };

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [data?.ping, refetch]);

  const fillQueue = () => {
    let count = 0;
    const queueSize = 10;

    const intervalId = setInterval(async () => {
      if (count >= queueSize) {
        clearInterval(intervalId);
        return;
      }
      try {
        await addRandomParties();
      } catch (err) {
        console.error('Error adding random parties:', err);
      }
      count++;
    }, 1000);
  };

  return (
    <>
      {!open && (
        <Button
          variant="contained"
          size="small"
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            bgcolor: '#00FF00',
            color: '#000',
            fontFamily: 'Courier New, monospace',
            zIndex: 1300,
            '&:hover': {
              bgcolor: '#00CC00',
            },
          }}
          onClick={() => setOpen(true)}
        >
          OPEN DEV PANEL
        </Button>
      )}

      <Drawer
        anchor="left"
        open={open}
        variant="persistent"
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#000',
              color: '#00FF00',
              fontFamily: 'Courier New, monospace',
              width: 320,
            },
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={1}
          borderBottom="1px solid #004400"
        >
          <IconButton
            onClick={() => setOpen(false)}
            size="small"
            sx={{ color: '#00FF00' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: '#004400' }} />

        <Box px={2} mt={1}>
          {!uuid ? (
            <Typography>Loading UUID...</Typography>
          ) : (
            <>
              <Typography sx={{ mb: 1 }}>
                <code>Your UUID:</code> <strong>{uuid}</strong>
              </Typography>
              <Button
                onClick={removeUUID}
                size="small"
                variant="outlined"
                sx={{
                  color: '#00FF00',
                  borderColor: '#00FF00',
                  fontFamily: 'Courier New, monospace',
                }}
              >
                Clear UUID
              </Button>
            </>
          )}

          {isLoading && (
            <Typography mt={2}>
              Ping: <code>awaiting response...</code>
            </Typography>
          )}

          {error && (
            <Typography color="error" mt={2}>
              Backend error: <code>{(error as Error).message}</code>
            </Typography>
          )}

          {data?.system?.[0] && (
            <Box mt={2}>
              <Typography>✔ Backend Status: ONLINE</Typography>
              <Typography>
                Total Seats: <code>{totalSeats}</code>
              </Typography>
              <Typography>
                Available Seats: <code>{availableSeats}</code>
              </Typography>
              <Typography>
                Next Party ID: <code>{nextPartyId}</code>
              </Typography>
              <Typography>
                Next Party Size: <code>{nextPartySize ?? '?'}</code>
              </Typography>
              <Typography>
                Your Party Size: <code>{customerSize ?? '?'}</code>
              </Typography>
              <Typography>
                Can seat next party?{' '}
                <code>{canSeatNextParty ? 'YES' : 'NO'}</code>
              </Typography>
              <Typography>
                Are you next party?{' '}
                <code>{isUserNextParty ? 'YES' : 'NO'}</code>
              </Typography>

              <Box fontSize={14} mt={1}>
                <Typography>
                  <code>🟢</code> = Your party
                </Typography>
                <Typography>
                  <code>🟩</code> = Other parties
                </Typography>
                <Typography>
                  <code>⬛</code> = Empty
                </Typography>
              </Box>

              <Box mt={1} fontSize={20} fontFamily="Courier New, monospace">
                Seats: <br />
                {renderSeats(totalSeats, availableSeats ?? 0, 0)}
              </Box>
            </Box>
          )}

          {/* Queue viz */}
          <Box mt={2} fontFamily="Courier New, monospace" fontSize={16}>
            <Typography>Queue (waiting parties):</Typography>
            {waitingParties.length === 0 && (
              <Typography>(No parties waiting)</Typography>
            )}
            {waitingParties.map((party) => {
              const isYourParty = party.partyID === joinedPartyID;
              return (
                <Box
                  key={party.uuid}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mt={0.5}
                >
                  <Typography>{party.partyID}</Typography>
                  <span>
                    {isYourParty
                      ? '🟢'.repeat(party.size) + '(You)'
                      : '🟩'.repeat(party.size)}
                  </span>
                </Box>
              );
            })}
          </Box>

          {joinedPartyID && (
            <Typography mt={2}>
              Assigned Party ID: <code>{joinedPartyID}</code>
            </Typography>
          )}

          <Button
            variant="contained"
            color="success"
            size="small"
            sx={{ mt: 2, fontFamily: 'Courier New, monospace' }}
            onClick={fillQueue}
            disabled={mutation.status === 'pending'}
          >
            Fill Queue
          </Button>

          {patchError && (
            <Typography color="error" mt={2}>
              Patch Error: <code>{String(patchError)}</code>
            </Typography>
          )}
        </Box>
      </Drawer>
    </>
  );
}
