'use client';
import Typography from '@mui/material/Typography';
import StatusComponent from '@/components/StatusComponent';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TableForm from '@/components/TableForm';

// content, form of the dashboard
// states - idle, showForm, formSubmitted, inQueue, readyToCheckIn
export default function HomePage() {
  // temporary state switcher
  const state = 'showForm';
  return (
    <>
      {/* top */}
      <div>
        {/* status shown in all states, with form changing on state */}
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
        {state == 'idle' && (
          <>
            <Typography variant="h5" component="p">
              Get in the queue?
            </Typography>
            <Button variant="outlined">Join queue</Button>
          </>
        )}
        {state == 'showForm' && <TableForm />}
      </div>
    </>
  );
}
