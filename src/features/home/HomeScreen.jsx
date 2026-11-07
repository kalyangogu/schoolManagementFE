import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/ui/Icon';
import { Avatar, BottomSheet, useDialog } from '../../components/ui';
import { useStyles, useTheme } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { activeSchool } from '../../config/schools';
import { modulesForRole } from '../../navigation/modules';
import { ROLE_LABEL } from '../../utils/format';

export default function HomeScreen({ navigation }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  const { activeProfile, profiles, switchProfile, logout } = useAuth();
  const [sheet, setSheet] = useState(false);
  const dialog = useDialog();
  const modules = modulesForRole(activeProfile.role);

  const confirmLogout = async () => {
    const ok = await dialog.confirm({
      title: 'Log out?',
      message: 'You will need your ID and password to log in again.',
      confirmText: 'Log out',
      destructive: true,
    });
    if (ok) logout();
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.topBar}>
          <View style={s.logo}><Text style={s.logoText}>{activeSchool.logoText}</Text></View>
          <Pressable style={s.switcher} onPress={() => setSheet(true)}>
            <View style={{ flex: 1 }}>
              <Text style={s.name} numberOfLines={1}>{activeProfile.name}</Text>
              <Text style={s.hint} numberOfLines={1}>{ROLE_LABEL[activeProfile.role]} · Tap to change</Text>
            </View>
            <Icon name="chevron-down" size={18} color={t.colors.textMuted} />
          </Pressable>
          {activeProfile.role === 'STUDENT' ? (
            <Pressable onPress={() => navigation.navigate('SecurityQuestions')} hitSlop={8} accessibilityLabel="Security questions">
              <Icon name="shield-account-outline" size={24} color={t.colors.primary} />
            </Pressable>
          ) : null}
          <Pressable onPress={confirmLogout} hitSlop={8} accessibilityLabel="Log out">
            <Icon name="log-out-outline" size={24} color={t.colors.primary} />
          </Pressable>
        </View>

        <View style={s.hero}>
          <Text style={s.heroSchool}>{activeSchool.displayName}</Text>
          <Text style={s.heroSub}>{activeProfile.name} | {ROLE_LABEL[activeProfile.role]}</Text>
        </View>

        <View style={s.grid}>
          {modules.map((m) => (
            <Pressable key={m.key} onPress={() => navigation.navigate(m.key)} style={({ pressed }) => [s.tile, pressed && { opacity: 0.8 }]}>
              <View style={s.iconBox}><Icon name={m.icon} size={24} color={t.colors.primary} /></View>
              <Text style={s.tileText} numberOfLines={2}>{m.title}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomSheet visible={sheet} onClose={() => setSheet(false)} title="Choose profile" subtitle="Switch role or student without signing in again.">
        {profiles.map((p) => {
          const on = p.id === activeProfile.id;
          return (
            <Pressable key={p.id} onPress={() => { switchProfile(p.id); setSheet(false); }} style={[s.profile, on && s.profileOn]}>
              <Avatar name={p.name} />
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{p.name}</Text>
                <Text style={s.hint}>{ROLE_LABEL[p.role]} | {activeSchool.displayName}</Text>
              </View>
              {on ? <Icon name="checkmark-circle" size={22} color={t.colors.primary} /> : null}
            </Pressable>
          );
        })}
      </BottomSheet>
    </SafeAreaView>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.colors.background },
    content: { padding: t.spacing.lg, gap: t.spacing.lg, paddingBottom: t.spacing.xxl },
    topBar: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
    logo: { width: 44, height: 44, borderRadius: t.radius.md, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center' },
    logoText: { color: t.colors.onPrimary, fontWeight: '800' },
    switcher: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
    name: { fontSize: t.fontSize.md, fontWeight: '700', color: t.colors.text },
    hint: { fontSize: t.fontSize.xs + 1, color: t.colors.textMuted },
    hero: { backgroundColor: t.colors.primaryDark, borderRadius: t.radius.lg, padding: t.spacing.xl, gap: 4, ...t.shadow },
    heroSchool: { fontSize: t.fontSize.xxl - 4, fontWeight: '800', color: '#fff' },
    heroSub: { fontSize: t.fontSize.sm + 1, color: 'rgba(255,255,255,0.75)' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.md },
    tile: { width: '31%', flexGrow: 1, aspectRatio: 1, backgroundColor: t.colors.surface, borderRadius: t.radius.lg, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 8, borderWidth: 1, borderColor: t.colors.border },
    iconBox: { width: 48, height: 48, borderRadius: t.radius.md, backgroundColor: t.colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
    tileText: { fontSize: t.fontSize.sm, fontWeight: '700', color: t.colors.text, textAlign: 'center' },
    profile: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: t.radius.md, borderWidth: 1, borderColor: t.colors.border, marginBottom: 8 },
    profileOn: { backgroundColor: t.colors.primaryTint, borderColor: t.colors.primary },
  });
