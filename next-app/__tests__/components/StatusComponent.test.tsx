import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Status from '@/components/StatusComponent';

describe('StatusComponent', () => {
  it('renders wait time for idle state', () => {
    render(<Status state="idle" estimateInMinutes={45} />);
    expect(screen.getByText('45 minute wait...')).toBeInTheDocument();
  });

  it('renders wait time correctly for small numbers', () => {
    render(<Status state="idle" estimateInMinutes={7} />);
    expect(screen.getByText('7 minute wait...')).toBeInTheDocument();
  });

  it('renders wait time as-is even if negative', () => {
    render(<Status state="idle" estimateInMinutes={-2} />);
    expect(screen.getByText('No wait')).toBeInTheDocument();
  });

  it('renders party ID in queue state', () => {
    render(
      <Status
        state="inQueue"
        estimateInMinutes={15}
        name="The Smiths"
        partyID="123"
        nextPartyID="122"
      />
    );
    expect(
      screen.getByText("You're in the queue, The Smiths")
    ).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(
      screen.getByText('We are currently seating Queue Number: 122')
    ).toBeInTheDocument();
    expect(screen.getByText('15 minute wait...')).toBeInTheDocument();
  });

  it('renders readyToCheckIn message', () => {
    render(
      <Status
        state="readyToCheckIn"
        estimateInMinutes={30}
        name="The Smiths"
        partyID="123"
      />
    );
    expect(
      screen.getByText('Your table is ready, The Smiths')
    ).toBeInTheDocument();
    expect(screen.getByText('Show this to the host:')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();

    // Should NOT show the wait time
    expect(screen.queryByText(/minute wait/i)).not.toBeInTheDocument();
  });
});
