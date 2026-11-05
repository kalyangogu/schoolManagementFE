import React, { useEffect, useState } from 'react';
import { Card, Select, DateField, Button, ListRow, Badge, EmptyState } from '../../components/ui';
import useAsync from '../../hooks/useAsync';
import { api } from '../../services/api';
import { addDays, todayISO } from '../../utils/format';
import useClassSelect from './useClassSelect';

export default function StudentReport() {
  const classOptions = useClassSelect();
  const [classId, setClassId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [from, setFrom] = useState(addDays(todayISO(), -30));
  const [to, setTo] = useState(todayISO());
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const students = useAsync(() => (classId ? api.students.list({ classId }) : Promise.resolve([])), [classId]);
  useEffect(() => { setStudentId(null); setRows(null); }, [classId]);

  const load = async () => {
    setLoading(true);
    try { setRows(await api.attendance.studentReport({ studentId, from, to })); } finally { setLoading(false); }
  };

  return (
    <Card title="Student attendance report">
      <Select label="Class" value={classId} options={classOptions} onChange={setClassId} placeholder="Select class" />
      <Select label="Student" value={studentId} options={(students.data || []).map((s) => ({ label: s.name, value: s.id }))} onChange={setStudentId} disabled={!classId} placeholder="Select student" />
      <DateField label="From" value={from} onChange={setFrom} />
      <DateField label="To" value={to} onChange={setTo} />
      <Button title="Load student report" loading={loading} disabled={!studentId} onPress={load} />
      {rows === null ? null : rows.length === 0 ? <EmptyState text="No attendance records found." /> : rows.map((r) => (
        <ListRow key={r.date} avatar={null} title={r.date} right={<Badge label={r.status} tone={r.status === 'ABSENT' ? 'danger' : 'success'} />} />
      ))}
    </Card>
  );
}
