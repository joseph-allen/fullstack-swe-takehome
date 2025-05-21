'use client';

import { Card, Box } from '@mui/material';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#e4d7f6',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: { xs: '90vw', md: '50vw' },
          minHeight: { xs: '50vh', md: '25vh' },
          padding: 4,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {children}
      </Card>
    </Box>
  );
}
