'use client';
import { useTheme } from '@mui/material/styles';
import { Card, Box } from '@mui/material';

const cardStyles = {
  width: '100%',
  maxWidth: { xs: '90vw', md: '50vw' },
  minHeight: { xs: '50vh', md: '25vh' },
  padding: 4,
  boxShadow: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();

  const boxStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: theme.palette.background.default,
  };

  return (
    <Box sx={boxStyles}>
      <Card sx={cardStyles}>{children}</Card>
    </Box>
  );
}
