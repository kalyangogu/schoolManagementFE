import React from 'react';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStyles } from '../../theme';

export default function BottomSheet({ visible, onClose, title, subtitle, children }) {
  const s = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={s.backdrop} onPress={onClose} />
      <View style={[s.sheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={s.handle} />
        {title ? <Text style={s.title}>{title}</Text> : null}
        {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
        <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
    sheet: { backgroundColor: t.colors.surface, borderTopLeftRadius: t.radius.xl, borderTopRightRadius: t.radius.xl, padding: t.spacing.lg, gap: 6 },
    handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: t.colors.border, marginBottom: 8 },
    title: { fontSize: t.fontSize.lg, fontWeight: '700', color: t.colors.text },
    subtitle: { fontSize: t.fontSize.sm, color: t.colors.textMuted, marginBottom: 8 },
  });
