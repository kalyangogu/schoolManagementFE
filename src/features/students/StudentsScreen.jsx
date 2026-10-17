import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, ListRow, SearchBar, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync, { useReloadOnFocus } from '../../hooks/useAsync';
import useDebounce from '../../hooks/useDebounce';
import { api } from '../../services/api';

export default function StudentsScreen({ navigation }) {
  const t = useTheme();
  const [q, setQ] = useState('');
  const dq = useDebounce(q);
  const { data, loading, reload } = useAsync(() => api.students.list({ q: dq }), [dq]);
  useReloadOnFocus(reload);

  return (
    <Screen
      title="Students" subtitle="School admin" onBack={navigation.goBack} onRefresh={reload} refreshing={loading && !!data}
      right={
        <Pressable onPress={() => navigation.navigate('AddStudent')} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="Add student">
          <Ionicons name="person-add-outline" size={20} color={t.colors.onPrimary} />
        </Pressable>
      }
    >
      <SearchBar value={q} onChangeText={setQ} placeholder="Type student name or phone" />
      <Card title="All students">
        {!data ? <EmptyState loading /> : data.length === 0 ? <EmptyState icon="people-outline" text="No students found." /> : data.map((s) => (
          <ListRow key={s.id} title={s.name} subtitle={`${s.phone || 'Phone number not added'} • #${s.id}`} caption={s.className || undefined} />
        ))}
      </Card>
    </Screen>
  );
}
