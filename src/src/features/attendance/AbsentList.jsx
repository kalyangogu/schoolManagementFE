import React, { useState } from 'react';
import { Card, Select, DateField, Button, ListRow, EmptyState } from '../../components/ui';
import { api } from '../../services/api';
import { todayISO } from '../../utils/format';
import useClassSelect from './useClassSelect';
import { Text } from 'react-native';
import { useTheme } from '../../theme';

export default function AbsentList() {
  const t = useTheme();
  const classOptions = useClassSelect();
  const [classId, setClassId] = useState(null);
  const [date, setDate] = useState(todayISO());
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!classId) return;
    setLoading(true);
    try { setRows(await api.attendance.absent({ classId, date })); } finally { setLoading(false); }
  };

  return (
    <Card title="Absent students">
      <Select label="Class" value={classId} options={classOptions} onChange={(v) => { setClassId(v); setRows(null); }} placeholder="Select class" />
      <DateField value={date} onChange={(d) => { setDate(d); setRows(null); }} />
      <Button title="Load absentees" loading={loading} disabled={!classId} onPress={load} />
      {rows === null ? null : rows.length === 0 ? <EmptyState icon="happy-outline" text="No absent students found for this day." /> : rows.map((s) => (
        <ListRow key={s.id} icon="person-remove-outline" title={s.name} subtitle={s.phone} />
      ))}
    </Card>
  );
}
