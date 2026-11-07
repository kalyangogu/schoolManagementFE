import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme, useStyles } from '../../theme';
import Button from './Button';
import Icon from './Icon';

// ─────────────────────────────────────────────────────────────────────────────
// Themed pop-up that replaces Alert.alert (which does nothing in a web browser).
//
//   const { confirm, alert } = useDialog();
//
//   const ok = await confirm({ title: 'Log out?', message: '…', confirmText: 'Log out', destructive: true });
//   if (ok) logout();
//
//   await alert({ title: 'Saved', message: 'All done.' });
// ─────────────────────────────────────────────────────────────────────────────
const DialogContext = createContext({ confirm: async () => false, alert: async () => {} });
export const useDialog = () => useContext(DialogContext);

export function DialogProvider({ children }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  const [dialog, setDialog] = useState(null);
  const pending = useRef(null); // resolves the promise of the dialog currently on screen

  const open = useCallback((config) => new Promise((resolve) => {
    if (pending.current) pending.current(false); // a new dialog replaces any open one
    pending.current = resolve;
    setDialog(config);
  }), []);

  const close = useCallback((result) => {
    const resolve = pending.current;
    pending.current = null;
    setDialog(null);
    if (resolve) resolve(result);
  }, []);

  const api = useMemo(() => ({
    confirm: ({ title, message, confirmText = 'OK', cancelText = 'Cancel', destructive = false }) =>
      open({ kind: 'confirm', title, message, confirmText, cancelText, destructive }),
    alert: ({ title, message, buttonText = 'OK' }) =>
      open({ kind: 'alert', title, message, confirmText: buttonText }).then(() => undefined),
  }), [open]);

  const danger = dialog && dialog.destructive;

  return (
    <DialogContext.Provider value={api}>
      {children}
      <Modal visible={!!dialog} transparent animationType="fade" onRequestClose={() => close(false)} statusBarTranslucent>
        <View style={s.root}>
          <Pressable style={s.backdrop} onPress={() => close(false)} accessibilityLabel="Close dialog" />
          {dialog ? (
            <View style={s.box} accessibilityViewIsModal accessibilityRole="alert">
              <View style={[s.iconWrap, { backgroundColor: danger ? t.colors.dangerTint : t.colors.primaryTint }]}>
                <Icon name={danger ? 'alert-circle' : 'information-circle-outline'} size={26} color={danger ? t.colors.danger : t.colors.primary} />
              </View>
              {dialog.title ? <Text style={s.title}>{dialog.title}</Text> : null}
              {dialog.message ? <Text style={s.message}>{dialog.message}</Text> : null}
              <View style={s.actions}>
                {dialog.kind === 'confirm' ? (
                  <Button style={s.btn} variant="outline" title={dialog.cancelText} onPress={() => close(false)} />
                ) : null}
                <Button style={s.btn} variant={danger ? 'danger' : 'primary'} title={dialog.confirmText} onPress={() => close(true)} />
              </View>
            </View>
          ) : null}
        </View>
      </Modal>
    </DialogContext.Provider>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: t.spacing.xl },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
    box: { width: '100%', maxWidth: 380, backgroundColor: t.colors.surface, borderRadius: t.radius.xl, padding: t.spacing.xl, alignItems: 'center', gap: t.spacing.md, ...t.shadow },
    iconWrap: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: t.fontSize.lg + 1, fontWeight: '800', color: t.colors.text, textAlign: 'center' },
    message: { fontSize: t.fontSize.md, color: t.colors.textMuted, textAlign: 'center', lineHeight: 21 },
    actions: { flexDirection: 'row', gap: t.spacing.md, alignSelf: 'stretch', marginTop: t.spacing.sm },
    btn: { flex: 1 },
  });
