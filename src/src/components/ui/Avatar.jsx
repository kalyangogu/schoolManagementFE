import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStyles } from '../../theme';
import { initial } from '../../utils/format';

export default function Avatar({ name, size = 42, children }) {
  const s = useStyles(makeStyles);
  return (
    <View style={[s.box, { width: size, height: size, borderRadius: size / 2 }]}>
      {children || <Text style={[s.text, { fontSize: size * 0.4 }]}>{initial(name)}</Text>}
    </View>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    box: { backgroundColor: t.colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
    text: { color: t.colors.primary, fontWeight: '700' },
  });
