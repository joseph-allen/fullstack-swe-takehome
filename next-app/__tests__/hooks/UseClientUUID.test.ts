// __tests__/useClientUUID.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useClientUUID } from '@/hooks/useClientUUID';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('useClientUUID (cookie-based)', () => {
  const mockUUID = '1234-5678-mock-uuid';

  beforeEach(() => {
    (uuidv4 as jest.Mock).mockReturnValue(mockUUID);

    // Clear cookies
    document.cookie.split(';').forEach((c) => {
      const [name] = c.trim().split('=');
      document.cookie = `${name}=; max-age=0; path=/;`;
    });
  });

  it('returns existing UUID from cookie if present', async () => {
    document.cookie = `user-uuid=existing-uuid-0001; max-age=14400; path=/;`;

    const { result } = renderHook(() => useClientUUID());

    await waitFor(() => {
      expect(result.current.uuid).toBe('existing-uuid-0001');
    });

    expect(uuidv4).not.toHaveBeenCalled();
  });

  it('generates and sets a new UUID cookie if none exists', async () => {
    const { result } = renderHook(() => useClientUUID());

    // wait for uuid to be set and no longer null
    await waitFor(() => {
      expect(result.current.uuid).toBe(mockUUID);
    });

    // check cookie was set
    expect(document.cookie).toContain(`user-uuid=${mockUUID}`);
  });

  it('removes the UUID from cookie when removeUUID is called', async () => {
    const { result } = renderHook(() => useClientUUID());

    // Wait for initial UUID to be set
    await waitFor(() => {
      expect(result.current.uuid).toBe(mockUUID);
    });

    // Call removeUUID to delete the cookie and reset uuid state
    act(() => {
      result.current.removeUUID();
    });

    // Wait for the hook to update the state after removal
    await waitFor(() => {
      expect(result.current.uuid).toBeNull();
    });

    expect(document.cookie).not.toContain('user-uuid=');
  });
});
