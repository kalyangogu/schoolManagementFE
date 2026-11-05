import React, { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { Card, Select, TextField, Button, ListRow, Banner, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync from '../../hooks/useAsync';
import useAction from '../../hooks/useAction';
import { api } from '../../services/api';
import { money } from '../../utils/format';
import useClassOptions from './useClassOptions';

export default function SetClassFee() {
  const t = useTheme();
  const { classOptions, periodOptions } = useClassOptions();
  const [classId, setClassId] = useState(null);
  const [period, setPeriod] = useState('Term 1');
  const [amount, setAmount] = useState('');
  const [applyAll, setApplyAll] = useState(true);
  const { data: fees, reload } = useAsync(() => api.fees.classFees());
  const [save, saving] = useAction(api.fees.setClassFee, 'Class fee saved');

  const submit = async () => {
    const { ok } = await save({ classId, period, amount, applyToAll: applyAll });
    if (ok) { setAmount(''); reload(); }
  };

  return (
    <>
      <Card title="First choose these details">
        <Select label="Class" value={classId} options={classOptions} onChange={setClassId} placeholder="Choose a class" />
        <Select label="Fee period" value={period} options={periodOptions} onChange={setPeriod} />
        {!classId ? <Text style={{ color: t.colors.primary, fontWeight: '700', fontSize: t.fontSize.sm }}>Please choose a class before continuing.</Text> : null}
      </Card>

      <Card title="Fees already set">
        {!fees ? <EmptyState loading /> : fees.length === 0 ? <EmptyState text="No fees set yet." /> : fees.map((f) => (
          <ListRow
            key={`${f.classId}-${f.period}`} avatar={null} title={`${f.className} · ${f.period}`} subtitle={money(f.amount)}
            onPress={() => { setClassId(f.classId); setPeriod(f.period); setAmount(String(f.amount)); }}
          />
        ))}
      </Card>

      {classId ? (
        <Card title="Set fee for this class">
          <TextField label="Amount each student must pay" placeholder="5000" keyboardType="number-pad" value={amount} onChangeText={(v) => setAmount(v.replace(/[^\d.]/g, ''))} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: t.colors.text }}>Apply this fee to all students</Text>
              <Text style={{ color: t.colors.textMuted, fontSize: t.fontSize.sm }}>Adds the fee automatically for every active student in the class.</Text>
            </View>
            <Switch value={applyAll} onValueChange={setApplyAll} trackColor={{ true: t.colors.primary }} />
          </View>
          <Button title="Save class fee" loading={saving} onPress={submit} />
        </Card>
      ) : (
        <Banner text="Choose a class above to set its fee." />
      )}
    </>
  );
}
