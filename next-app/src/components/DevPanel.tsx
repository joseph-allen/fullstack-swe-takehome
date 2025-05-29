'use client';
// This component is purely used to play around with the front-end
// It's not tested, and doesn't update as frequently as it should do
import { useState, useEffect, useCallback } from 'react';
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

// Extracted font and color variables
const COLORS = {
  brightGreen: '#00FF00',
  darkGreen: '#00CC00',
  backgroundBlack: '#000',
  borderGreen: '#004400',
  textBlack: '#000',
  error: 'error', // MUI color keyword
};

const FONTS = {
  monospace: 'Courier New, monospace',
};

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
  const mutation = useJoinQueueMutation(() => {
    // does nothing
  });

  const [open, setOpen] = useState(false);

  // We can seat a party if availible seats,
  // and next party size is defined(it won't be if the resturant is empty)
  // If there is space for the next party, they can be seated
  const canSeatNextParty =
    availableSeats !== null &&
    nextPartySize !== null &&
    availableSeats >= nextPartySize;

  // Are we the next party?
  const isUserNextParty = joinedPartyID === nextPartyId;

  // Handler to clear UUID and force page reload
  const handleClearUUID = () => {
    removeUUID();
    window.location.reload();
  };

  // Add a single random party
  const addRandomPartiesWithDelay = useCallback(
    async (count = 3) => {
      const sizes = [2, 3, 4, 5, 6];

      for (let i = 0; i < count; i++) {
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const party = generateRandomParty(size);

        try {
          await new Promise<void>((resolve, reject) => {
            mutation.mutate(party, {
              onSuccess: () => resolve(),
              onError: (error) => reject(error),
            });
          });
          refetch?.(); // Refresh after each add
          await new Promise((r) => setTimeout(r, 1000)); // 1 second delay
        } catch (err) {
          console.error('Error adding random party:', err);
          break; // Optionally stop on error
        }
      }
    },
    [mutation, refetch]
  );

  // Refetch parties whenever ping changes,
  // force queue to re-render when availible seats changes,
  // force re-render when user enters queue
  useEffect(() => {
    refetch?.();
  }, [data?.ping, availableSeats, customerSize, refetch]);

  // Render party queue list
  const renderPartyQueue = () => {
    if (waitingParties.length === 0) {
      return <Typography>(No parties waiting)</Typography>;
    }
    return waitingParties.map((party) => {
      const isYourParty = party.partyID === joinedPartyID;
      return (
        <Box
          key={party.uuid}
          display="flex"
          alignItems="center"
          gap={1}
          mt={0.5}
          component="div"
        >
          <Typography>{party.partyID}</Typography>
          <span>
            {isYourParty
              ? '🟢'.repeat(party.size) + '(You)'
              : '🟩'.repeat(party.size)}
          </span>
        </Box>
      );
    });
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
            bgcolor: COLORS.brightGreen,
            color: COLORS.textBlack,
            fontFamily: FONTS.monospace,
            '&:hover': {
              bgcolor: COLORS.darkGreen,
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
              bgcolor: COLORS.backgroundBlack,
              color: COLORS.brightGreen,
              fontFamily: FONTS.monospace,
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
          borderBottom={`1px solid ${COLORS.borderGreen}`}
        >
          <IconButton
            onClick={() => setOpen(false)}
            size="small"
            sx={{ color: COLORS.brightGreen }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: COLORS.borderGreen }} />

        <Box px={2} mt={1}>
          {!uuid ? (
            <Typography>Loading UUID...</Typography>
          ) : (
            <>
              <Typography sx={{ mb: 1 }}>
                <code>Your UUID:</code> <strong>{uuid}</strong>
              </Typography>
              <Button
                onClick={handleClearUUID}
                size="small"
                variant="outlined"
                sx={{
                  color: COLORS.brightGreen,
                  borderColor: COLORS.brightGreen,
                  fontFamily: FONTS.monospace,
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
            <Typography color={COLORS.error} mt={2}>
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

              <Box mt={1} fontSize={20} fontFamily={FONTS.monospace}>
                Seats: <br />
                {renderSeats(totalSeats, availableSeats ?? 0, 0)}
              </Box>
            </Box>
          )}

          {/* Queue visualization */}
          <Box mt={2} fontFamily={FONTS.monospace} fontSize={16}>
            <Typography>Queue (waiting parties):</Typography>
            {renderPartyQueue()}
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
            sx={{ mt: 2, fontFamily: FONTS.monospace }}
            onClick={() => addRandomPartiesWithDelay(3)}
            disabled={mutation.status === 'pending'}
          >
            Fill Queue
          </Button>

          {patchError && (
            <Typography color={COLORS.error} mt={2}>
              Patch Error: <code>{String(patchError)}</code>
            </Typography>
          )}
        </Box>
      </Drawer>
    </>
  );
}
