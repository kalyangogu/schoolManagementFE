import React from 'react';
import { Pressable, Text, ActivityIndicator, View, StyleSheet } from 'react-native';
import Icon from './Icon';
import { useTheme, useStyles } from '../../theme';

// variant: primary | outline | soft | danger | ghost
export default function Button({ title, onPress, icon, variant = 'primary', loading = false, disabled = false, style, small = false }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  const filled = variant === 'primary' || variant === 'danger';
  const bg = variant === 'primary' ? t.colors.primary : variant === 'danger' ? t.colors.danger : variant === 'soft' ? t.colors.primaryTint : 'transparent';
  const fg = filled ? t.colors.onPrimary : t.colors.primary;
  const borderColor = variant === 'outline' ? t.colors.primary : 'transparent';
  const off = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      style={({ pressed }) => [s.base, small && s.small, { backgroundColor: bg, borderColor, opacity: off ? 0.55 : pressed ? 0.85 : 1 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={s.row}>
          {icon ? <Icon name={icon} size={small ? 16 : 19} color={fg} /> : null}
          <Text style={[s.text, small && s.textSmall, { color: fg }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    base: { minHeight: 50, borderRadius: t.radius.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', paddingHorizontal: t.spacing.lg },
    small: { minHeight: 36, paddingHorizontal: t.spacing.md, borderRadius: t.radius.sm },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    text: { fontSize: t.fontSize.md, fontWeight: '700' },
    textSmall: { fontSize: t.fontSize.sm },
  });
