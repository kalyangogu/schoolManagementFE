import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Card, Select, Button, StatTile, ListRow, Badge, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme';
import { api } from '../../services/api';
import useExamOptions from './useExamOptions';

const grade = (p) => (p >= 90 ? 'A+' : p >= 75 ? 'A' : p >= 60 ? 'B' : p >= 45 ? 'C' : p >= 35 ? 'D' : 'F');
const tone = (p) => (p >= 60 ? 'success' : p >= 35 ? 'warning' : 'danger');

export default function Results() {
  const t = useTheme();
  const { groupOptions, classOptions } = useExamOptions();
  const [groupId, setGroupId] = useState(null);
  const [classId, setClassId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setData(await api.exams.performance({ groupId, classId })); } finally { setLoading(false); }
  };

  return (
    <Card title="Class performance" subtitle="Overall class results, subject insights and report cards.">
      <Select label="Exam group" value={groupId} options={groupOptions} onChange={(v) => { setGroupId(v); setData(null); }} placeholder="Select group" />
      <Select label="Class" value={classId} options={classOptions} onChange={(v) => { setClassId(v); setData(null); }} placeholder="Select class" />
      <Button title="Load class performance" icon="chart-line" loading={loading} disabled={!groupId || !classId} onPress={load} />
      {!data ? <Text style={{ color: t.colors.textMuted }}>Load a group and class to view results.</Text> : data.students.length === 0 ? <EmptyState icon="clipboard-text-outline" text="No marks recorded yet for this group and class." /> : (
        <>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <StatTile label="Class average" value={`${data.average}%`} />
            <StatTile label="Highest" value={`${data.highest}%`} tone="success" />
            <StatTile label="Pass rate" value={`${data.passRate}%`} tone="info" />
          </View>

          <Text style={{ fontWeight: '700', color: t.colors.text, marginTop: 4 }}>Subject averages</Text>
          {data.subjects.map((s) => (
            <View key={s.subject} style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ flex: 1, color: t.colors.text, fontWeight: '600' }}>{s.subject}</Text>
                <Text style={{ color: t.colors.textMuted, fontWeight: '700' }}>{s.average}%</Text>
              </View>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: t.colors.primaryTint }}>
                <View style={{ height: 8, borderRadius: 4, width: `${Math.min(100, s.average)}%`, backgroundColor: t.colors.primary }} />
              </View>
            </View>
          ))}

          <Text style={{ fontWeight: '700', color: t.colors.text, marginTop: 4 }}>Student results</Text>
          {data.students.map((s, i) => (
            <ListRow key={s.studentId} icon={i === 0 ? 'trophy-outline' : undefined} title={s.name} subtitle={`${s.total} / ${s.max} marks · ${s.percent}%`} right={<Badge label={grade(s.percent)} tone={tone(s.percent)} />} />
          ))}
        </>
      )}
    </Card>
  );
}
