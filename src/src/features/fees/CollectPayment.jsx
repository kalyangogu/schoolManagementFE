import React, { useState } from 'react';
import { Text } from 'react-native';
import { Card, Select, TextField, Button, ListRow, SearchBar, EmptyState, Banner } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync from '../../hooks/useAsync';
import useAction from '../../hooks/useAction';
import { api } from '../../services/api';
import { money } from '../../utils/format';
import useClassOptions from './useClassOptions';

const MODES = ['Cash', 'UPI', 'Card', 'Cheque'].map((m) => ({ label: m, value: m.toUpperCase() }));

export default function CollectPayment() {
  const t = useTheme();
  const { classOptions, periodOptions } = useClassOptions();
  const [classId, setClassId] = useState(null);
  const [period, setPeriod] = useState('Term 1');
  const [q, setQ] = useState('');
  const [student, setStudent] = useState(null);
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('CASH');
  const [note, setNote] = useState('');

  const roster = useAsync(() => (classId ? api.fees.roster({ classId, period }) : Promise.resolve([])), [classId, period]);
  const past = useAsync(() => (student ? api.fees.payments({ studentId: student.studentId, period }) : Promise.resolve([])), [student, period]);
  const [save, saving] = useAction(api.fees.collect, 'Payment saved');

  const list = (roster.data || []).filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));

  const submit = async () => {
    const { ok } = await save({ studentId: student.studentId, classId, period, amount, mode, note });
    if (ok) { setAmount(''); setNote(''); roster.reload(); past.reload(); }
  };

  return (
    <>
      <Card title="First choose these details">
        <Select label="Class" value={classId} options={classOptions} onChange={(v) => { setClassId(v); setStudent(null); }} placeholder="Choose a class" />
        <Select label="Fee period" value={period} options={periodOptions} onChange={setPeriod} />
      </Card>

      {classId ? (
        <Card title="Choose a student">
          <SearchBar value={q} onChangeText={setQ} placeholder="Search student name" />
          {roster.loading && !roster.data ? <EmptyState loading /> : list.length === 0 ? <EmptyState icon="people-outline" text="No students in this class." /> : list.map((s) => (
            <ListRow key={s.studentId} title={s.name} subtitle={`Assigned ${money(s.assigned)} · Paid ${money(s.paid)}`} selected={student && student.studentId === s.studentId} onPress={() => setStudent(s)} />
          ))}
        </Card>
      ) : <Banner text="Choose a class to see its students." />}

      {student ? (
        <>
          <Card title={`Enter payment received`} subtitle={student.name}>
            <TextField label="Amount received" placeholder="1000" keyboardType="number-pad" value={amount} onChangeText={(v) => setAmount(v.replace(/[^\d.]/g, ''))} />
            <Select label="How was it paid?" value={mode} options={MODES} onChange={setMode} />
            <TextField label="Note (optional)" placeholder="Receipt note" value={note} onChangeText={setNote} />
            <Button title="Save payment" loading={saving} onPress={submit} />
          </Card>
          <Card title="Past payments">
            {(past.data || []).length === 0 ? <Text style={{ color: t.colors.textMuted }}>No payments yet for {period}.</Text> : past.data.map((p) => (
              <ListRow key={p.id} icon="receipt-outline" title={money(p.amount)} subtitle={`${p.mode} · ${p.date}`} />
            ))}
          </Card>
        </>
      ) : null}
    </>
  );
}
