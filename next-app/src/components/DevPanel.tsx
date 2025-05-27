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

type DevPanelProps = {
  joinedPartyID: string;
  patchError: unknown;
};

export default function DevPanel({ joinedPartyID, patchError }: DevPanelProps) {
  const { uuid, removeUUID } = useUUID();
  const { data, error, isLoading } = usePingDB();
  const [open, setOpen] = useState(true);
  const [totalSeats, setTotalSeats] = useState<number>(0);
  const [availableSeats, setAvailableSeats] = useState<number | null>(null);
  const [nextPartyId, setNextPartyId] = useState<string>('000');
  const [nextPartySize, setNextPartySize] = useState<number | null>(null);

  useEffect(() => {
    if (data?.system?.[0]) {
      setTotalSeats(data.system[0].totalSeats);
      setAvailableSeats(data.system[0].availableSeats);
      setNextPartyId(data.system[0].nextPartyId ?? '000');
      setNextPartySize(data.system[0].nextPartySize);
    }
  }, [data]);

  function renderSeats(total: number, available: number, partySize: number) {
    const filled = total - available;
    const numParty = Math.min(partySize, filled);
    const numOther = filled - numParty;

    let seatStr = '';
    for (let i = 0; i < total; i++) {
      if (i < numParty) {
        seatStr += '🟢'; // matrix green square for "current party"
      } else if (i < numParty + numOther) {
        seatStr += '🟩'; // other seated parties
      } else {
        seatStr += '⬛'; // empty seat
      }
    }
    return seatStr;
  }

  const canSeatNextParty =
    availableSeats !== null &&
    nextPartySize !== null &&
    availableSeats >= nextPartySize;

  const isUserNextParty = joinedPartyID === nextPartyId;

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
            zIndex: 1300, // above MUI drawer
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
        PaperProps={{
          sx: {
            bgcolor: '#000000',
            color: '#00FF00',
            fontFamily: 'Courier New, monospace',
            width: 320,
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

          {data && data.system?.[0] && (
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
                Can seat next party?
                <code>{canSeatNextParty ? ' YES' : ' NO'}</code>
              </Typography>
              <Typography>
                Are you next party?
                <code>{isUserNextParty ? ' YES' : ' NO'}</code>
              </Typography>

              <Box mt={1} fontSize={20} fontFamily="Courier New, monospace">
                Seats: <br />
                {renderSeats(
                  totalSeats,
                  availableSeats ?? 0,
                  nextPartySize ?? 0
                )}
              </Box>
            </Box>
          )}

          {joinedPartyID && (
            <Typography mt={2}>
              Assigned Party ID: <code>{joinedPartyID}</code>
            </Typography>
          )}

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
