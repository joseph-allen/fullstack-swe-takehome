'use client';
import Container from '@/components/Container';
import ButtonWithState from '@/components/ButtonWithState';
import Typography from '@mui/material/Typography';

export default function HomePage() {
  return (
    <Container>
      <Typography variant="h1">Hello World</Typography>
      <ButtonWithState />
    </Container>
  );
}
