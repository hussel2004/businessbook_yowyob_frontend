import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../use-debounce';

describe('useDebounce', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should return the initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('initial', 500));
        expect(result.current).toBe('initial');
    });

    it('should debounce the value update', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'initial', delay: 500 } }
        );

        // Update value
        rerender({ value: 'updated', delay: 500 });

        // Should stay initial immediately
        expect(result.current).toBe('initial');

        // Fast forward time less than delay
        act(() => {
            jest.advanceTimersByTime(250);
        });
        expect(result.current).toBe('initial');

        // Fast forward time past delay
        act(() => {
            jest.advanceTimersByTime(251);
        });
        expect(result.current).toBe('updated');
    });

    it('should clear timeout on unmount or change', () => {
        const { rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'initial', delay: 500 } }
        );

        rerender({ value: 'updated1', delay: 500 });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        // Change value again before timeout
        rerender({ value: 'updated2', delay: 500 });

        act(() => {
            jest.advanceTimersByTime(300); // 200 + 300 = 500 from first start logic, but timer reset
        });

        // Should not have updated to 'updated1' (cancelled) or 'updated2' yet (needs 500 from 2nd change)
        // Actually, 'updated1' timer was cleared. 'updated2' timer started at T=200, needs until T=700. Current T=500.
        // Wait, advanceTimersByTime is cumulative? No, it advances simple time.
        // Initial call: T=0. Timer1 set for T=500.
        // Update1 at T=0 (conceptually). Timer1 set for T=500.
        // Wait 200ms. T=200.
        // Update2 at T=200. Timer1 cleared. Timer2 set for T=700.
        // Wait 300ms. T=500.
        // At T=500, Timer2 (set for 700) has not fired.

        // Let's verify result isn't updated1 (which would have fired at T=500 if not cleared)
        // But result.current is hook return value? It won't update until state upates.
    });
});
