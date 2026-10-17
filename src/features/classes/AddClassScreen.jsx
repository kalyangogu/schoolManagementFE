import React, { useState } from 'react';
import { Screen, Card, TextField, Button, Banner } from '../../components/ui';
import useAction from '../../hooks/useAction';
import { api } from '../../services/api';

export default function AddClassScreen({ navigation }) {
  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [error, setError] = useState('');
  const [save, saving] = useAction(api.classes.create, 'Class added');

  const submit = async () => {
    if (!name.trim()) return setError('Class name is required');
    const { ok } = await save({ name: name.trim(), teacherId: teacherId.trim() || undefined });
    if (ok) navigation.goBack();
  };

  return (
    <Screen title="Add class" subtitle="Create a new class" onBack={navigation.goBack}>
      <Banner text="This class will be added to academic year 1." />
      <Card title="Class information">
        <TextField label="Class name" required placeholder="Example: Class 1 or Grade 5" value={name} onChangeText={(v) => { setName(v); setError(''); }} error={error} />
        <TextField label="Teacher ID (optional)" placeholder="Can be added later" value={teacherId} onChangeText={setTeacherId} keyboardType="number-pad" />
        <Button title="Add class" icon="add" loading={saving} onPress={submit} />
      </Card>
    </Screen>
  );
}
