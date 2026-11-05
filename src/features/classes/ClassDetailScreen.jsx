import React from 'react';
import { Screen, Card, ListRow, EmptyState } from '../../components/ui';
import useAsync from '../../hooks/useAsync';
import { api } from '../../services/api';

export default function ClassDetailScreen({ navigation, route }) {
  const { classId, name } = route.params;
  const { data } = useAsync(() => api.students.list({ classId }), [classId]);
  return (
    <Screen title={name} subtitle="Students in this class" onBack={navigation.goBack}>
      <Card title={`Students${data ? ` (${data.length})` : ''}`}>
        {!data ? <EmptyState loading /> : data.length === 0 ? <EmptyState icon="people-outline" text="No students in this class yet." /> : data.map((s) => (
          <ListRow key={s.id} title={s.name} subtitle={s.phone || 'Phone number not added'} />
        ))}
      </Card>
    </Screen>
  );
}
