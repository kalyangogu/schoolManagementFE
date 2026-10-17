import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Screen, Card, Select, DateField, TextField, Button, ListRow, EmptyState, Badge } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync from '../../hooks/useAsync';
import useAction from '../../hooks/useAction';
import { api } from '../../services/api';
import { todayISO } from '../../utils/format';

const TYPES = ['Learn', 'Write', 'Read', 'Practice', 'Revision'].map((x) => ({ label: x, value: x }));

export default function DiaryScreen({ navigation }) {
  const t = useTheme();
  const [classId, setClassId] = useState(null);
  const [date, setDate] = useState(todayISO());
  const [subject, setSubject] = useState(null);
  const [type, setType] = useState('Learn');
  const [description, setDescription] = useState('');

  const classes = useAsync(() => api.classes.list());
  const subjects = useAsync(() => api.diary.subjects());
  const entries = useAsync(() => (classId ? api.diary.list({ classId, date }) : Promise.resolve([])), [classId, date]);
  const [save, saving] = useAction(api.diary.create, 'Diary entry saved');

  const submit = async () => {
    const { ok } = await save({ classId, date, subject, type, description });
    if (ok) { setDescription(''); entries.reload(); }
  };

  return (
    <Screen title="Diary" subtitle="Subject-wise daily entries" onBack={navigation.goBack} onRefresh={entries.reload}>
      <Card title="Class and date">
        <Select label="Class" value={classId} options={(classes.data || []).map((c) => ({ label: c.name, value: c.id }))} onChange={setClassId} placeholder="Select class" />
        <DateField value={date} onChange={setDate} />
      </Card>

      <Card title="Add diary entry">
        <Select label="Subject" value={subject} options={(subjects.data || []).map((x) => ({ label: x, value: x }))} onChange={setSubject} disabled={!classId} placeholder={classId ? 'Select subject' : 'Select a class first'} />
        <Select label="Entry type" value={type} options={TYPES} onChange={setType} />
        <TextField label="Description" placeholder="What should students do today?" multiline value={description} onChangeText={setDescription} />
        <Button title="Save diary entry" icon="add" loading={saving} disabled={!classId} onPress={submit} />
      </Card>

      <Card title={`Entries for ${date}`}>
        {!classId ? <Text style={{ color: t.colors.textMuted }}>Select a class to view its diary.</Text> : (entries.data || []).length === 0 ? <EmptyState icon="journal-outline" text="No diary entries found for this selection." /> : entries.data.map((e) => (
          <ListRow key={e.id} icon="journal-outline" title={e.subject} subtitle={e.description} right={<Badge label={e.type} />} />
        ))}
      </Card>
    </Screen>
  );
}
