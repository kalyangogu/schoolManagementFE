import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Card, Select, TextField, Button, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync from '../../hooks/useAsync';
import useAction from '../../hooks/useAction';
import { api } from '../../services/api';
import { prettyDate } from '../../utils/format';
import useExamOptions from './useExamOptions';

export default function EnterMarks() {
  const t = useTheme();
  const { groupOptions, classOptions } = useExamOptions();
  const [groupId, setGroupId] = useState(null);
  const [classId, setClassId] = useState(null);
  const [examId, setExamId] = useState(null);
  const [values, setValues] = useState({}); // studentId -> string

  const exams = useAsync(() => (groupId && classId ? api.exams.list({ groupId, classId }) : Promise.resolve([])), [groupId, classId]);
  const roster = useAsync(() => (examId ? api.exams.roster({ examId }) : Promise.resolve(null)), [examId]);

  const [save, saving] = useAction(async (payload) => {
    const max = roster.data.exam.maxMarks;
    for (const m of payload.marks) {
      if (Number(m.marks) > max) throw new Error(`Marks cannot be more than ${max}`);
    }
    return api.exams.saveMarks(payload);
  }, 'Marks saved');

  useEffect(() => { setExamId(null); }, [groupId, classId]);
  useEffect(() => {
    if (roster.data) setValues(Object.fromEntries(roster.data.students.map((s) => [s.studentId, s.marks === null ? '' : String(s.marks)])));
  }, [roster.data]);

  const submit = async () => {
    const marks = Object.entries(values).filter(([, v]) => v !== '').map(([studentId, v]) => ({ studentId: Number(studentId), marks: v }));
    if (marks.length === 0) return;
    const { ok } = await save({ examId, marks });
    if (ok) roster.reload();
  };

  const examOptions = (exams.data || []).map((e) => ({ label: `${e.subject} · ${prettyDate(e.date)}`, value: e.id }));
  const ex = roster.data && roster.data.exam;

  return (
    <Card title="Record marks" subtitle="Load the enrolled class roster and save marks in one pass.">
      <Select label="Exam group" value={groupId} options={groupOptions} onChange={setGroupId} placeholder="Select group" />
      <Select label="Class" value={classId} options={classOptions} onChange={setClassId} placeholder="Select class" />
      <Select label="Exam (subject)" value={examId} options={examOptions} onChange={setExamId} disabled={!groupId || !classId} placeholder={groupId && classId && examOptions.length === 0 ? 'No exams planned yet' : 'Select exam'} />
      {!examId ? <Text style={{ color: t.colors.textMuted }}>Select an exam to load pending and recorded marks.</Text> : !roster.data ? <EmptyState loading /> : (
        <>
          <Text style={{ color: t.colors.textMuted, fontWeight: '600' }}>Out of {ex.maxMarks} marks</Text>
          {roster.data.students.length === 0 ? <EmptyState icon="people-outline" text="No students in this class." /> : roster.data.students.map((s) => (
            <View key={s.studentId} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.colors.background, borderRadius: t.radius.md, padding: t.spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: t.colors.text }}>{s.name}</Text>
                <Text style={{ color: s.marks === null ? t.colors.warning : t.colors.success, fontSize: t.fontSize.sm, fontWeight: '600' }}>{s.marks === null ? 'Pending' : `Recorded: ${s.marks}`}</Text>
              </View>
              <TextField style={{ width: 100 }} placeholder="Marks" keyboardType="number-pad" maxLength={4} value={values[s.studentId] || ''} onChangeText={(v) => setValues((x) => ({ ...x, [s.studentId]: v.replace(/[^\d.]/g, '') }))} />
            </View>
          ))}
          <Button title="Save marks" icon="checkmark-circle-outline" loading={saving} onPress={submit} />
        </>
      )}
    </Card>
  );
}
