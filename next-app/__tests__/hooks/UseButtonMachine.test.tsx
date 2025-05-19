import { renderHook, act } from '@testing-library/react';
import { useButtonMachine } from '@/hooks/useButtonMachine';

describe('useButtonMachine hook', () => {
  it('initializes with the correct state', () => {
    const { result } = renderHook(() => useButtonMachine());
    expect(result.current.currentState).toBe('idle');
  });

  it('correctly transitions state when clicked', () => {
    const { result } = renderHook(() => useButtonMachine());

    act(() => {
      result.current.clickButton();
    });

    expect(result.current.currentState).toBe('clicked');
  });

  it('resets state correctly', () => {
    const { result } = renderHook(() => useButtonMachine());

    act(() => {
      result.current.clickButton();
    });
    act(() => {
      result.current.resetButton();
    });

    expect(result.current.currentState).toBe('idle');
  });
});
