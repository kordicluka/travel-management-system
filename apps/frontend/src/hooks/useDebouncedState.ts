import { useState, useEffect, useCallback } from 'react';

/**
 * Configuration for the useDebouncedState hook
 */
interface UseDebouncedStateConfig<T> {
  /** Initial value */
  initialValue: T;

  /** Debounce delay in milliseconds */
  delay: number;

  /** Optional callback when debounced value changes */
  onChange?: (value: T) => void;

  /** Optional callback when immediate value changes */
  onImmediateChange?: (value: T) => void;
}

/**
 * Return type for the useDebouncedState hook
 */
interface UseDebouncedStateReturn<T> {
  /** The immediate value (updated on every change) */
  immediateValue: T;

  /** The debounced value (updated after delay) */
  debouncedValue: T;

  /** Function to update the immediate value (debounced value follows after delay) */
  setValue: (value: T | ((prev: T) => T)) => void;

  /** Whether the debounced value is pending (user is typing) */
  isPending: boolean;
}

/**
 * Reusable hook for managing debounced state
 * Provides both immediate and debounced values
 * Useful for search inputs, filters, etc.
 *
 * @example
 * ```tsx
 * function SearchInput() {
 *   const { immediateValue, debouncedValue, setValue, isPending } = useDebouncedState({
 *     initialValue: '',
 *     delay: 500,
 *     onChange: (value) => {
 *       // Called when debounced value changes (after 500ms)
 *       console.log('Searching for:', value);
 *     },
 *   });
 *
 *   return (
 *     <div>
 *       <input
 *         value={immediateValue}
 *         onChange={(e) => setValue(e.target.value)}
 *         placeholder="Search..."
 *       />
 *       {isPending && <span>Searching...</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useDebouncedState<T>({
  initialValue,
  delay,
  onChange,
  onImmediateChange,
}: UseDebouncedStateConfig<T>): UseDebouncedStateReturn<T> {
  const [immediateValue, setImmediateValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const [isPending, setIsPending] = useState(false);

  // Handle immediate value changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setImmediateValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        onImmediateChange?.(newValue);
        return newValue;
      });
      setIsPending(true);
    },
    [onImmediateChange]
  );

  // Debounce the immediate value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(immediateValue);
      setIsPending(false);
      onChange?.(immediateValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [immediateValue, delay, onChange]);

  return {
    immediateValue,
    debouncedValue,
    setValue,
    isPending,
  };
}
