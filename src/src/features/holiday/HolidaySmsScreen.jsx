import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Pressable, Alert } from 'react-native';
import { Screen, Card, SegmentedTabs, DateField, TextField, Chip, Banner, Button, ListRow, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync from '../../hooks/useAsync';
import useAction from '../../hooks/useAction';
import { api } from '../../services/api';
import { todayISO, prettyDate } from '../../utils/format';

const TABS = [{ key: 'send', label: 'Send message', icon: 'send-outline' }, { key: 'past', label: 'Past messages', icon: 'time-outline' }];

export default function HolidaySmsScreen({ navigation }) {
  const t = useTheme();
  const [tab, setTab] = useState('send');
  const [multi, setMulti] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO());
  const [reason, setReason] = useState('');
  const [selected, setSelected] = useState([]);
  const [count, setCount] = useState(0);
  const classes = useAsync(() => api.classes.list());
  const history = useAsync(() => api.holiday.history());
  const [send, sending] = useAction(api.holiday.send, 'Message sent to parents');

  useEffect(() => { if (classes.data && selected.length === 0) setSelected(classes.data.map((c) => c.id)); }, [classes.data]);
  useEffect(() => { api.holiday.recipientCount({ classIds: selected }).then(setCount).catch(() => setCount(0)); }, [selected]);

  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const review = () =>
    Alert.alert('Send this message?', `${count} parent phone number(s) will be notified${reason ? `: "${reason.trim()}"` : ''}.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send', onPress: async () => { const { ok } = await send({ date, endDate: multi ? endDate : undefined, reason, classIds: selected }); if (ok) { setReason(''); history.reload(); } } },
    ]);

  const step = (n, label) => <Text style={{ fontWeight: '700', color: t.colors.primary }}>{n}  {label}</Text>;

  return (
    <Screen title="Holiday SMS" subtitle="Send a message to parents" onBack={navigation.goBack}>
      <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />
      {tab === 'send' ? (
        <Card title="Tell parents about a holiday" subtitle="Choose dates and classes, then notify the matched parents.">
          {step(1, 'Choose holiday date')}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontWeight: '600', color: t.colors.text }}>Multi-day holiday</Text>
            <Switch value={multi} onValueChange={setMulti} trackColor={{ true: t.colors.primary }} />
          </View>
          <DateField label={multi ? 'From' : 'Holiday date'} value={date} onChange={setDate} />
          {multi ? <DateField label="To" value={endDate} onChange={setEndDate} /> : null}

          {step(2, 'Write the reason')}
          <TextField placeholder="Reason for holiday" multiline value={reason} onChangeText={setReason} />

          {step(3, 'Choose which classes')}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, color: t.colors.textMuted, fontWeight: '600' }}>Classes</Text>
            <Pressable onPress={() => setSelected((classes.data || []).map((c) => c.id))} style={{ padding: 6 }}><Text style={{ color: t.colors.primary, fontWeight: '700' }}>All</Text></Pressable>
            <Pressable onPress={() => setSelected([])} style={{ padding: 6 }}><Text style={{ color: t.colors.primary, fontWeight: '700' }}>Clear</Text></Pressable>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {(classes.data || []).map((c) => <Chip key={c.id} label={c.name} selected={selected.includes(c.id)} onPress={() => toggle(c.id)} />)}
          </View>
          <Banner text={`${count} parent phone number(s) will receive this message.`} />
          <Button title="Review and send message" icon="send-outline" loading={sending} disabled={!reason.trim() || selected.length === 0} onPress={review} />
        </Card>
      ) : (
        <Card title="Past messages">
          {!history.data ? <EmptyState loading /> : history.data.length === 0 ? <EmptyState text="No messages sent yet." /> : history.data.map((m) => (
            <ListRow key={m.id} icon="chatbubble-ellipses-outline" title={m.reason} subtitle={`${prettyDate(m.date)}${m.endDate ? ` → ${prettyDate(m.endDate)}` : ''} · ${m.classCount} classes`} />
          ))}
        </Card>
      )}
    </Screen>
  );
}
