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

const centeredTextStyle = { marginTop: 2, textAlign: 'center' };

export const StatusComponent = ({
  state,
  name,
  partyID,
  nextPartyID,
  estimateInMinutes,
}: StatusComponentProps) => {
  const inQueue = state === 'inQueue';
  const readyToCheckIn = state === 'readyToCheckIn';

  const InQueue = () => (
    <>
      {/* Greeting */}
      <Typography variant="h4" component="p" sx={centeredTextStyle}>
        {`You're in the queue, ${name}`}
      </Typography>

      {/* Queue position info */}
      <Typography variant="h3" component="p" sx={centeredTextStyle}>
        {partyID}
      </Typography>
      <Typography
        variant="h5"
        component="p"
        sx={{ marginTop: 4, textAlign: 'center' }}
      >
        {`We are currently seating Queue Number: ${nextPartyID}`}
      </Typography>
    </>
  );

  const ReadyToCheckIn = () => (
    <>
      <Typography variant="h3" component="p" sx={centeredTextStyle}>
        {`Your table is ready, ${name}`}
      </Typography>
      <Typography variant="h4" component="p" sx={centeredTextStyle}>
        Show this to the host:
      </Typography>
      <Typography
        variant="h2"
        component="p"
        sx={{ marginTop: 8, textAlign: 'center' }}
      >
        {partyID}
      </Typography>
    </>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {inQueue && <InQueue />}
      {readyToCheckIn && <ReadyToCheckIn />}

      {/* Wait estimate always shown unless table is ready */}
      {!readyToCheckIn && (
        <Typography variant="h5" component="p" sx={{ marginTop: 2 }}>
          {estimateInMinutes <= 0
            ? 'No wait'
            : `${estimateInMinutes} minute wait...`}
        </Typography>
      )}
    </Box>
  );
};

export default StatusComponent;
