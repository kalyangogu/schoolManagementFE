import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStyles } from '../../theme';

export default function Card({ title, subtitle, children, style, right }) {
  const s = useStyles(makeStyles);
  return (
    <View style={[s.card, style]}>
      {title ? (
        <View style={s.head}>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{title}</Text>
            {subtitle ? <Text style={s.sub}>{subtitle}</Text> : null}
          </View>
          {right}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    card: { backgroundColor: t.colors.surface, borderRadius: t.radius.lg, padding: t.spacing.lg, gap: t.spacing.md, ...t.shadow },
    head: { flexDirection: 'row', alignItems: 'center' },
    title: { fontSize: t.fontSize.lg, fontWeight: '700', color: t.colors.text },
    sub: { fontSize: t.fontSize.sm, color: t.colors.textMuted, marginTop: 2 },
  });
