import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

type LoadingComponentProps = {
  text?: string;
  withDots?: boolean;
};

export const LoadingComponent = ({
  text = 'Loading...',
  withDots = false,
}: LoadingComponentProps) => {
  const [dots, setDots] = useState(1);

  // Animate dots every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev < 4 ? prev + 1 : 1));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
