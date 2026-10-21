import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Icon from '../../components/ui/Icon';
import { Screen, Card, SegmentedTabs, SearchBar, ListRow, TextField, DateField, Button, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync from '../../hooks/useAsync';
import useAction from '../../hooks/useAction';
import useDebounce from '../../hooks/useDebounce';
import { api } from '../../services/api';
import { todayISO } from '../../utils/format';

const TABS = [{ key: 'list', label: 'Circulars', icon: 'megaphone-outline' }, { key: 'create', label: 'Create', icon: 'add' }];

export default function CircularsScreen({ navigation }) {
  const t = useTheme();
  const [tab, setTab] = useState('list');
  const [q, setQ] = useState('');
  const dq = useDebounce(q);
  const [open, setOpen] = useState(null);
  const list = useAsync(() => api.circulars.list({ q: dq }), [dq]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(todayISO());
  const [save, saving] = useAction(api.circulars.create, 'Circular published');

  const submit = async () => {
    const { ok } = await save({ title: title.trim(), content: content.trim(), date });
    if (ok) { setTitle(''); setContent(''); setTab('list'); list.reload(); }
  };

  return (
    <Screen title="Circulars" subtitle="School notices" onBack={navigation.goBack} onRefresh={list.reload}>
      <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />
      {tab === 'list' ? (
        <Card title="Circulars">
          <SearchBar value={q} onChangeText={setQ} placeholder="Search title or content" />
          {!list.data ? <EmptyState loading /> : list.data.length === 0 ? <EmptyState icon="megaphone-outline" text="No circulars found." /> : list.data.map((c) => (
            <View key={c.id}>
              <ListRow avatar={null} title={c.title} subtitle={c.date} onPress={() => setOpen(open === c.id ? null : c.id)}
                right={<Icon name={open === c.id ? 'chevron-up' : 'chevron-down'} size={18} color={t.colors.textMuted} />} />
              {open === c.id ? <Text style={{ padding: 12, color: t.colors.text, lineHeight: 21 }}>{c.content}</Text> : null}
            </View>
          ))}
        </Card>
      ) : (
        <Card title="New circular">
          <TextField label="Title" required placeholder="Example: Annual Day" value={title} onChangeText={setTitle} />
          <DateField label="Date" value={date} onChange={setDate} />
          <TextField label="Content" required multiline placeholder="Write the notice for parents" value={content} onChangeText={setContent} />
          <Button title="Publish circular" icon="send-outline" loading={saving} disabled={!title.trim() || !content.trim()} onPress={submit} />
        </Card>
      )}
    </Screen>
  );
}
