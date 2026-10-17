import { useCallback, useRef, useState } from 'react';
import { useToast } from '../components/ui';

// Wrap a save/submit call: tracks loading, shows a toast on success/failure.
// const [save, saving] = useAction(api.students.create, 'Student added');
// const { ok, data } = await save(payload);
export default function useAction(fn, successMessage) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const run = useCallback(async (...args) => {
    setLoading(true);
    try {
      const data = await fnRef.current(...args);
      if (successMessage) toast.success(successMessage);
      return { ok: true, data };
    } catch (e) {
      toast.error(e.message || 'Something went wrong');
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }, [successMessage, toast]);
  return [run, loading];
}
