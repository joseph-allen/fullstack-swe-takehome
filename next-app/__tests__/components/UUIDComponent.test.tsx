import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UUIDComponent from '@/components/UUIDComponent';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('UUIDComponent (cookie-based)', () => {
  const mockUUID = 'test-uuid-1234';

  beforeEach(() => {
    // Clear all cookies before each test
    document.cookie.split(';').forEach((cookie) => {
      const [name] = cookie.split('=');
      document.cookie = `${name.trim()}=; max-age=0; path=/;`;
    });
    (uuidv4 as jest.Mock).mockClear();
  });

  it('displays loading message when UUID is not yet set', () => {
    render(<UUIDComponent />);
    expect(screen.getByText('Loading UUID...')).toBeInTheDocument();
  });

  it('generates and stores a new UUID cookie if none exists', async () => {
    (uuidv4 as jest.Mock).mockReturnValue(mockUUID);

    render(<UUIDComponent />);

    await waitFor(() =>
      expect(screen.getByText(`Your UUID: ${mockUUID}`)).toBeInTheDocument()
    );

    // Check cookie contains the new UUID
    expect(document.cookie).toContain(`user-uuid=${mockUUID}`);
  });

  it('uses existing UUID from cookie if present', async () => {
    // Set cookie before rendering
    document.cookie = `user-uuid=${mockUUID}; max-age=14400; path=/;`;

    render(<UUIDComponent />);

    await waitFor(() =>
      expect(screen.getByText(`Your UUID: ${mockUUID}`)).toBeInTheDocument()
    );

    expect(uuidv4).not.toHaveBeenCalled();
  });
});
