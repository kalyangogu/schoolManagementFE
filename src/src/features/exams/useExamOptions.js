import useAsync from '../../hooks/useAsync';
import { api } from '../../services/api';

// Dropdown data shared by the exam tabs.
export default function useExamOptions() {
  const groups = useAsync(() => api.exams.groups());
  const classes = useAsync(() => api.classes.list());
  return {
    groups,
    groupOptions: (groups.data || []).map((g) => ({ label: g.name, value: g.id })),
    classOptions: (classes.data || []).map((c) => ({ label: c.name, value: c.id })),
  };
}
