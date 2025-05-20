import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
type StatusComponentProps = {
  state: string;
  estimateInMinutes: number;
  name?: string;
  partyID?: number;
};

export const StatusComponent = ({
  state,
  estimateInMinutes,
  name,
  partyID,
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
      {/* Deal with the states in order, rather than complex nested logic */}
      {/* If in queue, we show the queue text, and the estimate below */}
      {state === 'in queue' && (
        <>
          {/* Add party ID as a subtle top right position flag for debugging */}
          <Typography
            variant="body2"
            component="p"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              marginTop: 2,
              marginRight: 2,
            }}
          >
            {`Party ID: ${partyID}`}
          </Typography>
          <Typography variant="h3" component="p" sx={{ marginTop: 2 }}>
            {`You're in the queue, ${name}`}
          </Typography>
        </>
      )}

      {/* If ready to check in, prompt the user */}
      {/* TODO: Trigger confetti? Get the users attention */}
      {state === 'ready to check in' && (
        <>
          {/* Show the user their table is ready */}
          <Typography variant="h3" component="p" sx={{ marginTop: 2 }}>
            {`Your table is ready, ${name}`}
          </Typography>
          <Typography variant="h4" component="p" sx={{ marginTop: 2 }}>
            {`Show this to the host, ${partyID}`}
          </Typography>
        </>
      )}

      {/* If user is not about to be checked in, we always show the estimate */}
      {state !== 'ready to check in' && (
        <Typography variant="h4" component="p" sx={{ marginTop: 2 }}>
          {/* estimate should never be negative, but just in case it is lets make it 0 if negative */}
          {estimateInMinutes > 0
            ? `${estimateInMinutes} minute wait`
            : '0 minute wait'}
        </Typography>
      )}
    </Box>
  );
};

export default StatusComponent;
