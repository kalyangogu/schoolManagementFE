import React, { useState } from 'react';
import { Card, TextField, Button, ListRow, EmptyState } from '../../components/ui';
import useAsync from '../../hooks/useAsync';
import useAction from '../../hooks/useAction';
import { api } from '../../services/api';

export default function ExamSetup() {
  const [name, setName] = useState('');
  const groups = useAsync(() => api.exams.groups());
  const [create, creating] = useAction(api.exams.createGroup, 'Exam group created');

  const submit = async () => {
    const { ok } = await create({ name });
    if (ok) { setName(''); groups.reload(); }
  };

  return (
    <Card title="Exam groups" subtitle="Create a named exam cycle such as Mid Term.">
      {!groups.data ? <EmptyState loading /> : groups.data.map((g) => <ListRow key={g.id} icon="folder-outline" title={g.name} />)}
      <TextField placeholder="Group name" value={name} onChangeText={setName} />
      <Button title="Create group" icon="add" loading={creating} disabled={!name.trim()} onPress={submit} />
    </Card>
  );
}
