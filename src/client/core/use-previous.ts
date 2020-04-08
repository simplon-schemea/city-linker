import { useRef } from "react";

export function usePrevious<T>(newValue: T): T | undefined;
export function usePrevious<T>(newValue: T, initialValue: T): T;
export function usePrevious<T>(newValue: T, initialValue?: T) {
    const ref = useRef<T>(initialValue as T);
    const { current: previous } = ref;

    ref.current = newValue;

    return previous;
}
