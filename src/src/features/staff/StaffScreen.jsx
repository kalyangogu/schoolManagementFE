import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Screen, Banner, SearchBar, Chip, ListRow, Button, EmptyState, Icon, useToast } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync, { useReloadOnFocus } from '../../hooks/useAsync';
import useDebounce from '../../hooks/useDebounce';
import { api } from '../../services/api';
import { ROLE_LABEL } from '../../utils/format';
import ResetPasswordSheet from '../auth/ResetPasswordSheet';

const FILTERS = [{ label: 'All staff', value: '' }, { label: 'Teachers', value: 'TEACHER' }, { label: 'Accountants', value: 'ACCOUNTANT' }];

export default function StaffScreen({ navigation }) {
  const t = useTheme();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [target, setTarget] = useState(null); // person whose password is being reset
  const dq = useDebounce(q);
  const { data, loading, reload } = useAsync(() => api.staff.list({ q: dq, role }), [dq, role]);
  useReloadOnFocus(reload);

  const toggle = async (s) => {
    try { await api.staff.setAccess({ id: s.id, active: !s.active }); toast.success(s.active ? 'Access stopped' : 'Access restored'); reload(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <Screen
      title="Staff users" subtitle="People who can use this app" onBack={navigation.goBack} onRefresh={reload} refreshing={loading && !!data}
      right={
        <Pressable onPress={() => navigation.navigate('AddStaff')} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="Add staff user">
          <Icon name="person-add-outline" size={20} color={t.colors.onPrimary} />
        </Pressable>
      }
    >
      <Banner text="Add teachers or office staff who need login access. You can stop or restore access, or set a new password, at any time." />
      <SearchBar value={q} onChangeText={setQ} placeholder="Search by name or phone number" />
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {FILTERS.map((f) => <Chip key={f.label} label={f.label} selected={role === f.value} onPress={() => setRole(f.value)} />)}
      </View>
      {!data ? <EmptyState loading /> : data.length === 0 ? <EmptyState icon="people-outline" text="No staff found." /> : data.map((s) => (
        <ListRow
          key={s.id} title={s.name} subtitle={s.phone}
          caption={s.roles.map((r) => ROLE_LABEL[r]).join(', ')}
          right={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Pressable onPress={() => setTarget({ name: s.name, userId: s.userId || s.id, loginId: s.loginId })} hitSlop={8} accessibilityLabel={`Reset password for ${s.name}`}>
                <Icon name="lock-reset" size={22} color={t.colors.primary} />
              </Pressable>
              {s.active ? <Button small variant="soft" title="Stop access" onPress={() => toggle(s)} /> : <Button small variant="outline" title="Allow" onPress={() => toggle(s)} />}
            </View>
          }
        />
      ))}
      <ResetPasswordSheet target={target} onClose={() => setTarget(null)} />
    </Screen>
  );
}
