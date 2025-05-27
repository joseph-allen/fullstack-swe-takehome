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

  useEffect(() => {
    if (data?.system?.[0]) {
      setTotalSeats(data.system[0].totalSeats);
      setAvailableSeats(data.system[0].availableSeats);
    }
  }, [data]);

  function renderSeats(total: number, available: number, partySize: number) {
    const filled = total - available;
    const numParty = Math.min(partySize, filled);
    const numOther = filled - numParty;

    let seatStr = '';
    for (let i = 0; i < totalSeats; i++) {
      if (i < numParty) {
        seatStr += '🥳';
      } else if (i < numParty + numOther) {
        seatStr += '😀';
      } else {
        seatStr += '🪑';
      }
    }
    return seatStr;
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      variant="persistent"
      PaperProps={{
        sx: { width: 320, p: 2 },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Dev Panel</Typography>
        <IconButton onClick={() => setOpen(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ my: 1 }} />

      {!uuid ? (
        <Typography>Loading UUID...</Typography>
      ) : (
        <>
          <Typography>Your UUID: {uuid}</Typography>
          <Button onClick={removeUUID} size="small">
            Clear UUID
          </Button>
        </>
      )}

      {isLoading && <Typography>Checking backend connection...</Typography>}
      {error && (
        <Typography color="error">
          Backend error: {(error as Error).message}
        </Typography>
      )}
      {data && data.system?.[0] && (
        <Box mt={2}>
          <Typography color="success.main">Backend OK</Typography>
          <Typography>Total Seats: {totalSeats}</Typography>
          <Typography>Available Seats: {availableSeats}</Typography>
          <Typography>
            Seats: {renderSeats(totalSeats!, availableSeats!, 0)}
          </Typography>
        </Box>
      )}

      {joinedPartyID && (
        <Typography mt={2}>
          Assigned partyID: <strong>{joinedPartyID}</strong>
        </Typography>
      )}

      {patchError && (
        <Typography color="error" mt={2}>
          Error updating status: {String(patchError)}
        </Typography>
      )}
    </Drawer>
  );
}
