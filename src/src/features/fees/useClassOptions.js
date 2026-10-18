import useAsync from '../../hooks/useAsync';
import { api } from '../../services/api';

// Shared dropdown data for the fee tabs: classes and fee periods as Select options.
export default function useClassOptions() {
  const classes = useAsync(() => api.classes.list());
  const periods = useAsync(() => api.fees.periods());
  return {
    classOptions: (classes.data || []).map((c) => ({ label: c.name, value: c.id })),
    periodOptions: (periods.data || []).map((p) => ({ label: p, value: p })),
  };
}
