import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useStyles } from '../../theme';
import Avatar from './Avatar';

// A tappable row: avatar | title + subtitle | right content (or a chevron when tappable)
export default function ListRow({ title, subtitle, caption, avatar, icon, right, onPress, selected, style }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  const left = icon ? (
    <Avatar size={42}><Ionicons name={icon} size={20} color={t.colors.primary} /></Avatar>
  ) : avatar !== null ? (
    <Avatar name={avatar || title} />
  ) : null;
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [s.row, selected && s.selected, pressed && { opacity: 0.85 }, style]}>
      {left}
      <View style={s.mid}>
        <Text style={s.title} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={s.sub} numberOfLines={2}>{subtitle}</Text> : null}
        {caption ? <Text style={s.caption}>{caption}</Text> : null}
      </View>
      {right || (onPress ? <Ionicons name="chevron-forward" size={18} color={t.colors.textMuted} /> : null)}
    </Pressable>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md, padding: t.spacing.md, borderRadius: t.radius.md, borderWidth: 1, borderColor: t.colors.border, backgroundColor: t.colors.surface },
    selected: { backgroundColor: t.colors.primaryTint, borderColor: t.colors.primary },
    mid: { flex: 1 },
    title: { fontSize: t.fontSize.md, fontWeight: '700', color: t.colors.text },
    sub: { fontSize: t.fontSize.sm, color: t.colors.textMuted, marginTop: 2 },
    caption: { fontSize: t.fontSize.xs, color: t.colors.primary, fontWeight: '700', marginTop: 3, letterSpacing: 0.3 },
  });
