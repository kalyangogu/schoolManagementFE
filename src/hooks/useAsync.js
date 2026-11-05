import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

// Load data from an api function. `reload()` refetches. Re-runs when `deps` change.
export default function useAsync(fn, deps = [], { immediate = true } = {}) {
  const [state, setState] = useState({ data: null, loading: immediate, error: null });
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fnRef.current();
      if (alive.current) setState({ data, loading: false, error: null });
      return data;
    } catch (e) {
      if (alive.current) setState((s) => ({ ...s, loading: false, error: e.message || 'Something went wrong' }));
      return null;
    }
  }, []);

  useEffect(() => { if (immediate) run(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, reload: run };
}

// Refetch when the screen comes back into focus (e.g. after adding a record).
export function useReloadOnFocus(reload) {
  const first = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (first.current) { first.current = false; return; }
      reload();
    }, [reload])
  );
}
