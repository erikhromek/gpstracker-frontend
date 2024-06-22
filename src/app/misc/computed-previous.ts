import { Signal, computed } from '@angular/core';

export function computedPrevious<T>(s: Signal<T>): Signal<T | null> {
  let current = null as T;
  let previous = null as T;

  return computed(() => {
    const value = s();
    if (value !== current) {
      previous = current;
      current = value;
    }
    return previous;
  });
}
