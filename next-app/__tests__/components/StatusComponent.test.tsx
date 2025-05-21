import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Status from '@/components/StatusComponent';

describe('Status', () => {
  // Test default props for our loading component
  it('renders status with set minutes', () => {
    render(<Status state="idle" estimateInMinutes={45} />);
    expect(screen.getByText('45 minute wait')).toBeInTheDocument();
  });

  it('renders status with set minutes', () => {
    render(<Status state="idle" estimateInMinutes={7} />);
    expect(screen.getByText('7 minute wait')).toBeInTheDocument();
  });

  it('renders status with negative minutes, should be cleaned for user', () => {
    render(<Status state="idle" estimateInMinutes={-2} />);
    expect(screen.getByText('0 minute wait')).toBeInTheDocument();
  });

  // Test custom text
  it('renders party ID if set', () => {
    render(
      <Status
        state="inQueue"
        estimateInMinutes={45}
        name="The Smiths"
        partyID={123}
      />
    );
    expect(screen.getByText('Party ID: 123')).toBeInTheDocument();
  });

  it('should render name if set', () => {
    render(
      <Status
        state="inQueue"
        estimateInMinutes={45}
        name="The Smiths"
        partyID={123}
      />
    );
    expect(screen.getByText('Welcome, The Smiths')).toBeInTheDocument();
  });

  it('renders invitation if ready to check in', () => {
    render(<Status state="readyToCheckIn" name="The Smiths" partyID={123} />);
    expect(screen.getByText('Show this to the host, 123')).toBeInTheDocument();
    // Check that the queue text is not rendered
    expect(screen.queryByText('minute wait')).not.toBeInTheDocument();
  });
});
