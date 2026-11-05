import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from '../../components/ui/Icon';
import { Card, Select, DateField, Button, EmptyState, Banner } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync from '../../hooks/useAsync';
import useAction from '../../hooks/useAction';
import { api } from '../../services/api';
import { todayISO } from '../../utils/format';
import useClassSelect from './useClassSelect';

export default function MarkAttendance() {
  const t = useTheme();
  const classOptions = useClassSelect();
  const [classId, setClassId] = useState(null);
  const [date, setDate] = useState(todayISO());
  const [absent, setAbsent] = useState({}); // { studentId: true }
  const roster = useAsync(() => (classId ? api.attendance.roster({ classId, date }) : Promise.resolve(null)), [classId, date]);
  const [save, saving] = useAction(api.attendance.save, 'Attendance saved');

  useEffect(() => {
    if (roster.data) setAbsent(Object.fromEntries(roster.data.filter((s) => s.absent).map((s) => [s.id, true])));
  }, [roster.data]);

  const list = roster.data || [];
  const absentIds = list.filter((s) => absent[s.id]).map((s) => s.id);
  const setAll = (isAbsent) => setAbsent(isAbsent ? Object.fromEntries(list.map((s) => [s.id, true])) : {});

  return (
    <Card title="Mark attendance">
      <Select label="Class" value={classId} options={classOptions} onChange={setClassId} placeholder="Select class" />
      <DateField value={date} onChange={setDate} />
      {!classId ? <Text style={{ color: t.colors.textMuted }}>Select a class to load its student roster.</Text> : roster.loading && !roster.data ? <EmptyState loading /> : list.length === 0 ? <EmptyState icon="people-outline" text="No students in this class." /> : (
        <>
          <Banner tone="info" text="Tick a student to mark them absent. Everyone else is marked present." />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, color: t.colors.textMuted, fontWeight: '600' }}>{list.length - absentIds.length} present · {absentIds.length} absent</Text>
            <Pressable onPress={() => setAll(false)} style={{ padding: 6 }}><Text style={{ color: t.colors.primary, fontWeight: '700' }}>All present</Text></Pressable>
            <Pressable onPress={() => setAll(true)} style={{ padding: 6 }}><Text style={{ color: t.colors.primary, fontWeight: '700' }}>All absent</Text></Pressable>
          </View>
          {list.map((s) => {
            const on = !!absent[s.id];
            return (
              <Pressable key={s.id} onPress={() => setAbsent((a) => ({ ...a, [s.id]: !a[s.id] }))} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: on ? t.colors.dangerTint : t.colors.successTint, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={on ? 'close' : 'checkmark'} size={20} color={on ? t.colors.danger : t.colors.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: t.colors.text }}>{s.name}</Text>
                  <Text style={{ color: t.colors.textMuted, fontSize: t.fontSize.sm }}>{s.phone || 'No phone'}</Text>
                </View>
                <Icon name={on ? 'checkbox' : 'square-outline'} size={24} color={on ? t.colors.danger : t.colors.textMuted} />
              </Pressable>
            );
          })}
          <Button title="Save attendance" icon="checkmark-circle-outline" loading={saving} onPress={() => save({ classId, date, absentIds })} />
        </>
      )}
    </Card>
  );
}
