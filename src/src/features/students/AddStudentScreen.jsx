import React, { useState } from 'react';
import { Screen, Card, TextField, Select, Button, Banner } from '../../components/ui';
import useAction from '../../hooks/useAction';
import { api } from '../../services/api';
import { isValidPhone } from '../../utils/format';

const LANGS = ['English', 'Telugu', 'Hindi'].map((l) => ({ label: l, value: l }));

export default function AddStudentScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('English');
  const [errors, setErrors] = useState({});
  const [save, saving] = useAction(api.students.create, 'Student added');

  const submit = async () => {
    const e = {};
    if (!name.trim()) e.name = 'Student name is required';
    if (phone && !isValidPhone(phone)) e.phone = 'Enter a 10 digit number';
    setErrors(e);
    if (Object.keys(e).length) return;
    const { ok } = await save({ name: name.trim(), phone, language });
    if (ok) navigation.goBack();
  };

  return (
    <Screen title="Add student" subtitle="Enter basic details" onBack={navigation.goBack}>
      <Banner text="Only the student name is compulsory. Add a parent phone number to receive school messages." />
      <Card title="Student information">
        <TextField label="Student full name" required placeholder="Example: Ravi Kumar" value={name} onChangeText={setName} error={errors.name} />
        <TextField label="Parent phone number" placeholder="10 digit mobile number" keyboardType="number-pad" maxLength={10} value={phone} onChangeText={(v) => setPhone(v.replace(/\D/g, ''))} error={errors.phone} />
        <Select label="Language for messages" value={language} options={LANGS} onChange={setLanguage} />
        <Button title="Add student" icon="person-add-outline" loading={saving} onPress={submit} />
      </Card>
    </Screen>
  );
}
