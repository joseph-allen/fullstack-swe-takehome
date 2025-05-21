import { renderHook, act } from '@testing-library/react';
import { useAppMachine } from '@/hooks/useAppMachine';

describe('useAppMachine hook', () => {
  it('initialises in the "idle" state', () => {
    const { result } = renderHook(() => useAppMachine());
    expect(result.current.currentState).toBe('idle');
  });

  it('transitions from idle → showForm on joinQueue()', () => {
    const { result } = renderHook(() => useAppMachine());

    act(() => {
      result.current.joinQueue();
    });

    expect(result.current.currentState).toBe('showForm');
  });

  it('transitions from showForm → formSubmitted on submitForm()', () => {
    const { result } = renderHook(() => useAppMachine());

    act(() => {
      result.current.joinQueue();
    });
    act(() => {
      result.current.submitForm();
    });

    expect(result.current.currentState).toBe('formSubmitted');
  });

  it('transitions from formSubmitted → inQueue on queueJoined()', () => {
    const { result } = renderHook(() => useAppMachine());

    act(() => {
      result.current.joinQueue();
    });
    act(() => {
      result.current.submitForm();
    });
    act(() => {
      result.current.queueJoined();
    });

    expect(result.current.currentState).toBe('inQueue');
  });

  it('transitions from inQueue → readyToCheckIn on readyToCheckIn()', () => {
    const { result } = renderHook(() => useAppMachine());

    act(() => {
      result.current.joinQueue();
    });
    act(() => {
      result.current.submitForm();
    });
    act(() => {
      result.current.queueJoined();
    });
    act(() => {
      result.current.readyToCheckIn();
    });

    expect(result.current.currentState).toBe('readyToCheckIn');
  });

  it('resets from readyToCheckIn → idle on reset()', () => {
    const { result } = renderHook(() => useAppMachine());

    act(() => {
      result.current.joinQueue();
    });
    act(() => {
      result.current.submitForm();
    });
    act(() => {
      result.current.queueJoined();
    });
    act(() => {
      result.current.readyToCheckIn();
    });
    act(() => {
      result.current.reset();
    });

    expect(result.current.currentState).toBe('idle');
  });

  it('transitions from inQueue → idle on leaveQueue()', () => {
    const { result } = renderHook(() => useAppMachine());

    act(() => {
      result.current.joinQueue();
    });
    act(() => {
      result.current.submitForm();
    });
    act(() => {
      result.current.queueJoined();
    });
    act(() => {
      result.current.leaveQueue();
    });

    expect(result.current.currentState).toBe('idle');
  });
});
