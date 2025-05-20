'use client';
import Typography from '@mui/material/Typography';
import StatusComponent from '@/components/StatusComponent';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

// content, form of the dashboard
export default function HomePage() {
  return (
    <>
      {/* top */}
      <div>
        {/* idle state, as the new user joins */}
        <StatusComponent state="idle" estimateInMinutes={45} />
      </div>
      <Divider flexItem />
      {/* bottom */}
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
          gap: '32px',
          alignItems: 'center',
        }}
      >
        {/* idle state, as the new user joins */}
        <Typography variant="h5" component="p">
          Get in the queue?
        </Typography>
        <Button variant="outlined">Join Queue</Button>
      </div>
    </>
  );
}
