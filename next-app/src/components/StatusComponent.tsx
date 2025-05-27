import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type StatusComponentProps = {
  state: 'idle' | 'showForm' | 'formSubmitted' | 'inQueue' | 'readyToCheckIn';
  name?: string;
  partyID?: string;
  nextPartyID?: string;
  estimateInMinutes: number;
};

export const StatusComponent = ({
  state,
  name,
  partyID,
  nextPartyID,
  estimateInMinutes,
}: StatusComponentProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {state === 'inQueue' && (
        <>
          {/* Greeting */}
          <Typography
            variant="h4"
            component="p"
            sx={{ marginTop: 2, textAlign: 'center' }}
          >
            {`You're in the queue, ${name}`}
          </Typography>

          {/* Queue position info */}
          <Typography
            variant="h3"
            component="p"
            sx={{ marginTop: 2, textAlign: 'center' }}
          >
            {partyID}
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{ marginTop: 4, textAlign: 'center' }}
          >
            We are currently seating Queue Number: {nextPartyID}
          </Typography>
        </>
      )}

      {state === 'readyToCheckIn' && (
        <>
          <Typography
            variant="h3"
            component="p"
            sx={{ marginTop: 2, textAlign: 'center' }}
          >
            Your table is ready, {name}
          </Typography>
          <Typography
            variant="h4"
            component="p"
            sx={{ marginTop: 2, textAlign: 'center' }}
          >
            Show this to the host: {partyID}
          </Typography>
        </>
      )}

      {/* Wait estimate always shown unless table is ready */}
      {state !== 'readyToCheckIn' && (
        <Typography variant="h5" component="p" sx={{ marginTop: 2 }}>
          {`${estimateInMinutes} minute wait...`}
        </Typography>
      )}
    </Box>
  );
};

export default StatusComponent;
