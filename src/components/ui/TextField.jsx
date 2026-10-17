import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useStyles } from '../../theme';

export default function TextField({ label, required, error, hint, icon, prefix, multiline, style, ...inputProps }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  const [focused, setFocused] = useState(false);
  return (
    <View style={style}>
      {label ? (
        <Text style={s.label}>
          {label}
          {required ? <Text style={{ color: t.colors.danger }}> *</Text> : null}
        </Text>
      ) : null}
      <View style={[s.box, focused && s.focused, !!error && s.errorBox, multiline && s.multiBox]}>
        {icon ? <Ionicons name={icon} size={19} color={t.colors.textMuted} style={{ marginRight: 8 }} /> : null}
        {prefix ? <Text style={s.prefix}>{prefix}</Text> : null}
        <TextInput
          {...inputProps}
          multiline={multiline}
          placeholderTextColor={t.colors.textMuted + '99'}
          onFocus={(e) => { setFocused(true); inputProps.onFocus && inputProps.onFocus(e); }}
          onBlur={(e) => { setFocused(false); inputProps.onBlur && inputProps.onBlur(e); }}
          style={[s.input, multiline && { minHeight: 88, textAlignVertical: 'top' }]}
        />
      </View>
      {error ? <Text style={s.error}>{error}</Text> : hint ? <Text style={s.hint}>{hint}</Text> : null}
    </View>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    label: { fontSize: t.fontSize.sm, fontWeight: '600', color: t.colors.text, marginBottom: 6 },
    box: { flexDirection: 'row', alignItems: 'center', minHeight: 50, borderWidth: 1.5, borderColor: t.colors.border, borderRadius: t.radius.md, paddingHorizontal: t.spacing.md, backgroundColor: t.colors.surface },
    multiBox: { alignItems: 'flex-start', paddingVertical: 8 },
    focused: { borderColor: t.colors.primary },
    errorBox: { borderColor: t.colors.danger },
    prefix: { fontSize: t.fontSize.md, color: t.colors.textMuted, marginRight: 6, fontWeight: '600' },
    input: { flex: 1, fontSize: t.fontSize.md, color: t.colors.text, paddingVertical: 10 },
    error: { color: t.colors.danger, fontSize: t.fontSize.xs + 1, marginTop: 4 },
    hint: { color: t.colors.textMuted, fontSize: t.fontSize.xs + 1, marginTop: 4 },
  });
