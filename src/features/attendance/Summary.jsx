import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import Icon from '../../components/ui/Icon';
import { Card, Select, DateField, Button, StatTile, ListRow, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme';
import { api } from '../../services/api';
import { addDays, todayISO } from '../../utils/format';
import useClassSelect from './useClassSelect';

export default function Summary() {
  const t = useTheme();
  const classOptions = useClassSelect();
  const [classId, setClassId] = useState(null);
  const [from, setFrom] = useState(addDays(todayISO(), -30));
  const [to, setTo] = useState(todayISO());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(null);

  const load = async () => {
    setLoading(true);
    try { setData(await api.attendance.summary({ classId, from, to })); } finally { setLoading(false); }
  };

  return (
    <Card title="Attendance summary">
      <Select label="Class" value={classId} options={classOptions} onChange={setClassId} placeholder="Select class" />
      <DateField label="From" value={from} onChange={setFrom} />
      <DateField label="To" value={to} onChange={setTo} />
      <Button title="Load summary" loading={loading} disabled={!classId} onPress={load} />
      {data ? (
        <>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <StatTile icon="calendar-outline" label="School days marked" value={String(data.days)} />
            <StatTile icon="person-remove-outline" label="Total absences" value={String(data.absences)} tone="danger" />
          </View>
          <Text style={{ fontWeight: '700', color: t.colors.text, marginTop: 4 }}>Absentees by day</Text>
          {data.byDay.length === 0 ? <EmptyState text="No attendance marked in this period." /> : data.byDay.map((d) => {
            const isOpen = open === d.date;
            return (
              <View key={d.date}>
                <ListRow
                  avatar={null} title={d.date} subtitle={`${d.students.length} student${d.students.length === 1 ? '' : 's'} absent`}
                  onPress={() => setOpen(isOpen ? null : d.date)}
                  right={<Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={t.colors.textMuted} />}
                />
                {isOpen ? d.students.map((s) => <ListRow key={s.id} icon="person-remove-outline" title={s.name} subtitle={s.phone} style={{ marginTop: 6, marginLeft: 12 }} />) : null}
              </View>
            );
          })}
        </>
      ) : null}
    </Card>
  );
}
