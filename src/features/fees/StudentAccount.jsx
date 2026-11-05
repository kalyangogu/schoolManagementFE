import React, { useState } from 'react';
import { View } from 'react-native';
import { Card, SearchBar, ListRow, StatTile, EmptyState } from '../../components/ui';
import useAsync from '../../hooks/useAsync';
import useDebounce from '../../hooks/useDebounce';
import { api } from '../../services/api';
import { money } from '../../utils/format';

export default function StudentAccount() {
  const [q, setQ] = useState('');
  const dq = useDebounce(q);
  const [student, setStudent] = useState(null);
  const results = useAsync(() => (dq.trim() ? api.students.list({ q: dq }) : Promise.resolve([])), [dq]);
  const ledger = useAsync(() => (student ? api.fees.ledger({ studentId: student.id }) : Promise.resolve(null)), [student]);

  return (
    <>
      <Card title="Find a student account">
        <SearchBar value={q} onChangeText={(v) => { setQ(v); setStudent(null); }} placeholder="Type student name or phone" />
        {(results.data || []).map((s) => (
          <ListRow key={s.id} title={s.name} subtitle={`${s.phone || 'No phone'} · #${s.id}`} selected={student && student.id === s.id} onPress={() => setStudent(s)} />
        ))}
      </Card>

      {student ? (
        <Card title={`${student.name} ledger`}>
          {!ledger.data ? <EmptyState loading /> : (
            <>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <StatTile label="Assigned" value={money(ledger.data.assigned).replace('.00', '')} />
                <StatTile label="Paid" value={money(ledger.data.paid).replace('.00', '')} tone="success" />
                <StatTile label="Due" value={money(ledger.data.due).replace('.00', '')} tone="danger" />
              </View>
              {ledger.data.items.map((i) => (
                <ListRow key={i.period} avatar={null} title={i.period} subtitle={`Assigned ${money(i.assigned)} · Paid ${money(i.paid)}`} />
              ))}
            </>
          )}
        </Card>
      ) : null}
    </>
  );
}
