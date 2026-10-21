import React from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from './Icon';
import { useTheme, useStyles } from '../../theme';

// Page wrapper: safe area + optional header (back button, title, right action) + scrolling body.
export default function Screen({ title, subtitle, onBack, right, children, onRefresh, refreshing = false, footer, contentStyle }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right', 'bottom']}>
      {title ? (
        <View style={s.header}>
          {onBack ? (
            <Pressable onPress={onBack} style={s.backBtn} hitSlop={8} accessibilityLabel="Go back">
              <Icon name="arrow-back" size={22} color={t.colors.primary} />
            </Pressable>
          ) : null}
          <View style={s.headerText}>
            <Text style={s.title} numberOfLines={1}>{title}</Text>
            {subtitle ? <Text style={s.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
          </View>
          {right}
        </View>
      ) : null}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[s.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={t.colors.primary} colors={[t.colors.primary]} /> : undefined
          }
        >
          {children}
        </ScrollView>
        {footer}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.colors.background },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: t.spacing.lg, paddingVertical: t.spacing.md, gap: t.spacing.md },
    backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: t.colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
    headerText: { flex: 1 },
    title: { fontSize: t.fontSize.xl, fontWeight: '700', color: t.colors.text },
    subtitle: { fontSize: t.fontSize.sm, color: t.colors.textMuted, marginTop: 1 },
    content: { padding: t.spacing.lg, paddingTop: t.spacing.sm, paddingBottom: t.spacing.xxl, gap: t.spacing.md },
  });
