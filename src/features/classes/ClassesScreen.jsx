import React from 'react';
import { Pressable } from 'react-native';
import Icon from '../../components/ui/Icon';
import { Screen, ListRow, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync, { useReloadOnFocus } from '../../hooks/useAsync';
import { api } from '../../services/api';

export default function ClassesScreen({ navigation }) {
  const t = useTheme();
  const { data, loading, reload } = useAsync(() => api.classes.list());
  useReloadOnFocus(reload);
  return (
    <Screen
      title="Classes" subtitle="Choose a class to continue" onBack={navigation.goBack} onRefresh={reload} refreshing={loading && !!data}
      right={
        <Pressable onPress={() => navigation.navigate('AddClass')} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="Add class">
          <Icon name="add" size={24} color={t.colors.onPrimary} />
        </Pressable>
      }
    >
      {!data ? <EmptyState loading /> : data.map((c) => (
        <ListRow key={c.id} avatar={null} title={c.name} subtitle={`${c.teacher || 'Teacher not assigned'} · Year 1`} onPress={() => navigation.navigate('ClassDetail', { classId: c.id, name: c.name })} />
      ))}
    </Screen>
  );
}
