import React, { useState } from 'react';
import { Screen, Card, TextField, Select, Button, Banner } from '../../components/ui';
import useAction from '../../hooks/useAction';
import { api } from '../../services/api';
import { isValidPhone } from '../../utils/format';

const ROLES = [{ label: 'Teacher', value: 'TEACHER' }, { label: 'Accountant', value: 'ACCOUNTANT' }];

export default function AddStaffScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('TEACHER');
  const [errors, setErrors] = useState({});
  const [save, saving] = useAction(api.staff.create, 'Staff user added');

  const submit = async () => {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!isValidPhone(phone)) e.phone = 'Enter a 10 digit mobile number';
    setErrors(e);
    if (Object.keys(e).length) return;
    const { ok } = await save({ name: name.trim(), phone, role });
    if (ok) navigation.goBack();
  };

  return (
    <Screen title="Add staff user" subtitle="Give app login access" onBack={navigation.goBack}>
      <Banner text="Use the staff member's working mobile number. They will use this number to log in." />
      <Card>
        <TextField label="Full name" required placeholder="Example: Suresh Kumar" value={name} onChangeText={setName} error={errors.name} />
        <TextField label="Mobile number" required placeholder="10 digit mobile number" keyboardType="number-pad" maxLength={10} value={phone} onChangeText={(v) => setPhone(v.replace(/\D/g, ''))} error={errors.phone} />
        <Select label="Work role" value={role} options={ROLES} onChange={setRole} />
        <Button title="Add staff user" icon="person-add-outline" loading={saving} onPress={submit} />
      </Card>
    </Screen>
  );
}
