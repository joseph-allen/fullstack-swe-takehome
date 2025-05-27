import { renderHook, act } from '@testing-library/react';
import { MAX_TABLE_SIZE, useTableForm } from '@/hooks/useTableForm';

describe('useTableForm hook', () => {
  it('initializes with default values and allows increment/decrement within bounds', () => {
    const { result } = renderHook(() => useTableForm());

    // default size is 1
    expect(result.current.size).toBe(1);

    // increment once
    act(() => {
      result.current.increment();
    });
    expect(result.current.size).toBe(2);

    // decrement once
    act(() => {
      result.current.decrement();
    });
    expect(result.current.size).toBe(1);

    // decrement below 1 should clamp to 1
    act(() => {
      result.current.decrement();
      result.current.decrement();
      result.current.decrement();
    });

    expect(result.current.size).toBe(1);

    // increment above MAX_TABLE_SIZE should clamp to MAX_TABLE_SIZE
    for (let i = 0; i < MAX_TABLE_SIZE - 1; i++) {
      act(() => {
        result.current.increment();
      });
    }

    expect(result.current.size).toBe(MAX_TABLE_SIZE);
  });

  it('calls mock onSubmit function when submitted', () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() => useTableForm(mockSubmit));

    act(() => {
      result.current.onSubmit({ name: 'Bob', size: 2 });
    });

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Bob', size: 2 })
    );
  });
});
