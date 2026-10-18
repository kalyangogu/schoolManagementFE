import useAsync from '../../hooks/useAsync';
import { api } from '../../services/api';

export default function useClassSelect() {
  const { data } = useAsync(() => api.classes.list());
  return (data || []).map((c) => ({ label: c.name, value: c.id }));
}
