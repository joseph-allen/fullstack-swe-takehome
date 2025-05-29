import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

type LoadingComponentProps = {
  text?: string;
  withDots?: boolean;
};

// useLoadingDots hook
function useLoadingDots(maxDots = 4, intervalMs = 2000) {
  const [dots, setDots] = useState(1);

  // Animate dots every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev < maxDots ? prev + 1 : 1));
    }, intervalMs);

    return () => clearInterval(interval);
  }, [maxDots, intervalMs]);

  return dots;
}

export const LoadingComponent = ({
  text = 'Loading...',
  withDots = false,
}: LoadingComponentProps) => {
  const dots = useLoadingDots();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src="/wine.apng"
        unoptimized
        alt="Loading - Animated icons by Lordicon.com"
        width={200}
        height={200}
        style={{ marginBottom: '10px' }}
        data-testid="loading-image"
      />
      <Typography variant="h4" component="span" sx={{ marginTop: 2 }}>
        {text}
        {withDots && (
          <span data-testid="loading-ellipsis">{'.'.repeat(dots)}</span>
        )}
      </Typography>
    </Box>
  );
};

export default LoadingComponent;
