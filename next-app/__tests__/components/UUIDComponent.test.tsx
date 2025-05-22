import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UUIDComponent from '@/components/UUIDComponent';
import { v4 as uuidv4 } from 'uuid';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('UUIDComponent', () => {
  const mockUUID = 'test-uuid-1234';
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows loading initially', () => {
    render(<UUIDComponent />);
    expect(screen.getByText('Loading UUID...')).toBeInTheDocument();
  });

  it('generates and displays a new UUID if none exists', async () => {
    (uuidv4 as jest.Mock).mockReturnValue(mockUUID);
    render(<UUIDComponent />);

    await waitFor(() =>
      expect(screen.getByText(`Your UUID: ${mockUUID}`)).toBeInTheDocument()
    );

    expect(localStorage.getItem('user-uuid')).toBe(mockUUID);
  });
});
