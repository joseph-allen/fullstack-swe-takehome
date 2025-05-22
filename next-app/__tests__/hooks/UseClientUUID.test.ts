// __tests__/useClientUUID.test.ts
import { renderHook, act } from '@testing-library/react';
import { useClientUUID } from '@/hooks/useClientUUID';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');

describe('useClientUUID', () => {
  const mockUUID = '1234-5678-mock-uuid';

  beforeEach(() => {
    localStorage.clear();
    (uuidv4 as jest.Mock).mockReturnValue(mockUUID);
  });

  it('returns existing UUID from localStorage if present', () => {
    localStorage.setItem('user-uuid', 'existing-uuid-0001');

    const { result } = renderHook(() => useClientUUID());

    expect(result.current).toBe('existing-uuid-0001');
  });

  it('generates and stores a new UUID if none exists', () => {
    const { result } = renderHook(() => useClientUUID());

    expect(localStorage.getItem('user-uuid')).toBe(mockUUID);
    expect(result.current).toBe(mockUUID);
  });
});
