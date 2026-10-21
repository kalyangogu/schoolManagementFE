import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from '../../components/ui/Icon';
import { Screen, Banner } from '../../components/ui';
import { useTheme, useStyles } from '../../theme';
import SetClassFee from './SetClassFee';
import CollectPayment from './CollectPayment';
import StudentAccount from './StudentAccount';
import CollectionReport from './CollectionReport';

const TABS = [
  { key: 'set', label: 'Set class fee', icon: 'pricetag-outline', View: SetClassFee },
  { key: 'collect', label: 'Collect payment', icon: 'cash-outline', View: CollectPayment },
  { key: 'account', label: 'Student account', icon: 'person-outline', View: StudentAccount },
  { key: 'report', label: 'Collection report', icon: 'stats-chart-outline', View: CollectionReport },
];

export default function FeesScreen({ navigation }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  const [tab, setTab] = useState('set');
  const Active = TABS.find((x) => x.key === tab).View;
  return (
    <Screen title="Fees" subtitle="Simple fee management" onBack={navigation.goBack}>
      <Banner text="Set fees for a class, collect payments, and see what is pending, all in one place." />
      <View style={s.grid}>
        {TABS.map((x) => {
          const on = x.key === tab;
          return (
            <Pressable key={x.key} onPress={() => setTab(x.key)} style={[s.tab, on && s.tabOn]}>
              <Icon name={x.icon} size={22} color={on ? t.colors.onPrimary : t.colors.primary} />
              <Text style={[s.tabText, on && { color: t.colors.onPrimary }]}>{x.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Active />
    </Screen>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.md },
    tab: { width: '47.5%', flexGrow: 1, minHeight: 76, backgroundColor: t.colors.surface, borderRadius: t.radius.md, padding: t.spacing.md, gap: 8, justifyContent: 'center', borderWidth: 1, borderColor: t.colors.border },
    tabOn: { backgroundColor: t.colors.primary, borderColor: t.colors.primary },
    tabText: { fontSize: t.fontSize.sm + 1, fontWeight: '700', color: t.colors.text },
  });
