import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Card, Select, StatTile, ListRow, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync from '../../hooks/useAsync';
import { api } from '../../services/api';
import { money } from '../../utils/format';
import useClassOptions from './useClassOptions';

export default function CollectionReport() {
  const t = useTheme();
  const { classOptions, periodOptions } = useClassOptions();
  const [classId, setClassId] = useState(null);
  const [period, setPeriod] = useState('Term 1');
  const { data } = useAsync(() => api.fees.report({ classId, period }), [classId, period]);
  const short = (n) => money(n).replace('.00', '');

  return (
    <>
      <Card title="Choose report details">
        <Select label="Class (optional)" value={classId} options={[{ label: 'All classes', value: null }, ...classOptions]} onChange={setClassId} placeholder="All classes" />
        <Select label="Fee period" value={period} options={periodOptions} onChange={setPeriod} />
      </Card>
      <Card title="Fee collection summary">
        {!data ? <EmptyState loading /> : (
          <>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <StatTile label="Total fee" value={short(data.total)} />
              <StatTile label="Received" value={short(data.received)} tone="success" />
              <StatTile label="Pending" value={short(data.pending)} tone="danger" />
            </View>
            <Text style={{ color: t.colors.textMuted, fontSize: t.fontSize.sm, textAlign: 'center' }}>This summary updates automatically when fees or payments change.</Text>
            {data.students.map((s) => (
              <ListRow key={s.studentId} title={s.name} subtitle={`Assigned ${money(s.assigned)} · Paid ${money(s.paid)}`} />
            ))}
          </>
        )}
      </Card>
    </>
  );
}
