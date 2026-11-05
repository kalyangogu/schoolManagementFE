import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Screen, Card, ListRow, SearchBar, EmptyState, Icon } from '../../components/ui';
import { useTheme } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import useAsync, { useReloadOnFocus } from '../../hooks/useAsync';
import useDebounce from '../../hooks/useDebounce';
import { api } from '../../services/api';
import ResetPasswordSheet from '../auth/ResetPasswordSheet';

export default function StudentsScreen({ navigation }) {
  const t = useTheme();
  const { activeProfile } = useAuth();
  const isAdmin = activeProfile.role === 'SCHOOL_ADMIN';
  const [q, setQ] = useState('');
  const [target, setTarget] = useState(null); // student whose password is being reset
  const dq = useDebounce(q);
  const { data, loading, reload } = useAsync(() => api.students.list({ q: dq }), [dq]);
  useReloadOnFocus(reload);

  return (
    <Screen
      title="Students" subtitle="School admin" onBack={navigation.goBack} onRefresh={reload} refreshing={loading && !!data}
      right={
        <Pressable onPress={() => navigation.navigate('AddStudent')} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="Add student">
          <Icon name="person-add-outline" size={20} color={t.colors.onPrimary} />
        </Pressable>
      }
    >
      <SearchBar value={q} onChangeText={setQ} placeholder="Type student name, admission no. or phone" />
      <Card title="All students">
        {!data ? <EmptyState loading /> : data.length === 0 ? <EmptyState icon="people-outline" text="No students found." /> : data.map((s) => (
          <ListRow
            key={s.id} title={s.name} subtitle={`${s.admissionNumber || `#${s.id}`} • ${s.phone || 'Phone number not added'}`} caption={s.className || undefined}
            right={isAdmin ? (
              <Pressable onPress={() => setTarget({ name: s.name, userId: s.userId, loginId: s.admissionNumber, isStudent: true })} hitSlop={10} accessibilityLabel={`Reset password for ${s.name}`}>
                <Icon name="lock-reset" size={22} color={t.colors.primary} />
              </Pressable>
            ) : undefined}
          />
        ))}
      </Card>
      <ResetPasswordSheet target={target} onClose={() => setTarget(null)} />
    </Screen>
  );
}
