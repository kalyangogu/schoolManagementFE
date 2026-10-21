import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Card, Select, DateField, TextField, Button, Icon, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync from '../../hooks/useAsync';
import useAction from '../../hooks/useAction';
import { api } from '../../services/api';
import { todayISO } from '../../utils/format';
import useExamOptions from './useExamOptions';

export default function PlanExams() {
  const t = useTheme();
  const { groupOptions, classOptions } = useExamOptions();
  const [groupId, setGroupId] = useState(null);
  const [classId, setClassId] = useState(null);
  const [rows, setRows] = useState({}); // subject -> { on, date, max }

  const subjects = useAsync(() => (classId ? api.exams.subjects({ classId }) : Promise.resolve([])), [classId]);
  const existing = useAsync(() => (groupId && classId ? api.exams.list({ groupId, classId }) : Promise.resolve([])), [groupId, classId]);
  const [save, saving] = useAction(api.exams.schedule, 'Exams scheduled');

  // Fill the form from what is already scheduled; tick everything when nothing is.
  useEffect(() => {
    if (!subjects.data || !existing.data) return;
    const next = {};
    subjects.data.forEach((sub) => {
      const ex = existing.data.find((e) => e.subject === sub);
      next[sub] = { on: !!ex || existing.data.length === 0, date: ex ? ex.date : todayISO(), max: String(ex ? ex.maxMarks : 100) };
    });
    setRows(next);
  }, [subjects.data, existing.data]);

  const patch = (sub, p) => setRows((r) => ({ ...r, [sub]: { ...r[sub], ...p } }));

  const submit = async () => {
    const items = Object.entries(rows).filter(([, v]) => v.on).map(([subject, v]) => ({ subject, date: v.date, maxMarks: v.max }));
    const { ok } = await save({ groupId, classId, items });
    if (ok) existing.reload();
  };

  const ready = groupId && classId;

  return (
    <Card title="Schedule exams" subtitle="Select subjects and schedule them for one class.">
      <Select label="Exam group" value={groupId} options={groupOptions} onChange={setGroupId} placeholder="Select group" />
      <Select label="Class" value={classId} options={classOptions} onChange={setClassId} placeholder="Select class" />
      {!ready ? <Text style={{ color: t.colors.textMuted }}>Select a group and class to load its subjects.</Text> : !subjects.data || !existing.data ? <EmptyState loading /> : (
        <>
          {subjects.data.map((sub) => {
            const r = rows[sub];
            if (!r) return null;
            return (
              <View key={sub} style={{ backgroundColor: t.colors.background, borderRadius: t.radius.md, padding: t.spacing.md, gap: 10 }}>
                <Pressable onPress={() => patch(sub, { on: !r.on })} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Icon name={r.on ? 'checkbox' : 'square-outline'} size={24} color={r.on ? t.colors.primary : t.colors.textMuted} />
                  <Text style={{ fontWeight: '700', fontSize: t.fontSize.md, color: t.colors.text }}>{sub}</Text>
                </Pressable>
                {r.on ? (
                  <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-end' }}>
                    <DateField style={{ flex: 1 }} value={r.date} onChange={(d) => patch(sub, { date: d })} />
                    <TextField style={{ width: 90 }} label="Max" keyboardType="number-pad" value={r.max} onChangeText={(v) => patch(sub, { max: v.replace(/\D/g, '') })} />
                  </View>
                ) : null}
              </View>
            );
          })}
          <Button title="Schedule selected subjects" icon="calendar-check" loading={saving} onPress={submit} />
        </>
      )}
    </Card>
  );
}
