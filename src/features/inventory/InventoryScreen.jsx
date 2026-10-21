import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from '../../components/ui/Icon';
import { Screen, Card, SegmentedTabs, SearchBar, ListRow, TextField, Button, Select, Chip, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync from '../../hooks/useAsync';
import useAction from '../../hooks/useAction';
import useDebounce from '../../hooks/useDebounce';
import { api } from '../../services/api';
import { money } from '../../utils/format';

const TABS = [{ key: 'items', label: 'Items', icon: 'cube-outline' }, { key: 'logs', label: 'Logs', icon: 'time-outline' }];

export default function InventoryScreen({ navigation }) {
  const t = useTheme();
  const [tab, setTab] = useState('items');
  const [q, setQ] = useState('');
  const dq = useDebounce(q);
  const items = useAsync(() => api.inventory.items({ q: dq }), [dq]);

  return (
    <Screen title="Inventory" subtitle="Items and stock movement" onBack={navigation.goBack} onRefresh={items.reload}>
      <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />
      {tab === 'items' ? <Items items={items} q={q} setQ={setQ} /> : <Logs items={items.data || []} />}
    </Screen>
  );
}

function Items({ items, q, setQ }) {
  const t = useTheme();
  const [selected, setSelected] = useState(null);
  const [type, setType] = useState('IN');
  const [qty, setQty] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', quantity: '', price: '' });
  const [adjust, adjusting] = useAction(api.inventory.adjust, 'Stock updated');
  const [create, creating] = useAction(api.inventory.create, 'Item created');
  const current = (items.data || []).find((i) => i.id === selected);

  return (
    <>
      <SearchBar value={q} onChangeText={setQ} placeholder="Search inventory" />
      {!items.data ? <EmptyState loading /> : items.data.length === 0 ? <EmptyState icon="cube-outline" text="No items yet." /> : items.data.map((i) => (
        <ListRow key={i.id} icon="cube-outline" title={i.name} subtitle={i.description} selected={selected === i.id} onPress={() => setSelected(i.id)}
          right={<View style={{ alignItems: 'flex-end' }}><Text style={{ fontWeight: '800', fontSize: t.fontSize.lg, color: t.colors.text }}>{i.quantity}</Text><Text style={{ color: t.colors.textMuted, fontSize: t.fontSize.sm }}>{money(i.price)}</Text></View>}
        />
      ))}

      {current ? (
        <Card title={`Update ${current.name}`}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip label="Stock in" selected={type === 'IN'} onPress={() => setType('IN')} />
            <Chip label="Stock out" selected={type === 'OUT'} onPress={() => setType('OUT')} />
          </View>
          <TextField placeholder="Quantity" keyboardType="number-pad" value={qty} onChangeText={(v) => setQty(v.replace(/\D/g, ''))} />
          <Button title="Update stock" loading={adjusting} onPress={async () => { const { ok } = await adjust({ itemId: current.id, type, quantity: qty }); if (ok) { setQty(''); items.reload(); } }} />
        </Card>
      ) : null}

      <Card>
        <Pressable onPress={() => setShowCreate((s) => !s)} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ flex: 1, fontSize: t.fontSize.lg, fontWeight: '700', color: t.colors.text }}>Create inventory item</Text>
          <Icon name={showCreate ? 'chevron-up' : 'chevron-down'} size={20} color={t.colors.textMuted} />
        </Pressable>
        {showCreate ? (
          <>
            <TextField placeholder="Item name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
            <TextField placeholder="Description (optional)" value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextField style={{ flex: 1 }} placeholder="Initial quantity" keyboardType="number-pad" value={form.quantity} onChangeText={(v) => setForm({ ...form, quantity: v.replace(/\D/g, '') })} />
              <TextField style={{ flex: 1 }} placeholder="Unit price" keyboardType="number-pad" value={form.price} onChangeText={(v) => setForm({ ...form, price: v.replace(/[^\d.]/g, '') })} />
            </View>
            <Button title="Create item" loading={creating} disabled={!form.name.trim()} onPress={async () => { const { ok } = await create(form); if (ok) { setForm({ name: '', description: '', quantity: '', price: '' }); setShowCreate(false); items.reload(); } }} />
          </>
        ) : null}
      </Card>
    </>
  );
}

function Logs({ items }) {
  const t = useTheme();
  const [itemId, setItemId] = useState(null);
  const [type, setType] = useState('');
  const logs = useAsync(() => (itemId ? api.inventory.logs({ itemId, type }) : Promise.resolve([])), [itemId, type]);
  return (
    <Card>
      <Select label="Item" value={itemId} options={items.map((i) => ({ label: i.name, value: i.id }))} onChange={setItemId} placeholder="Choose an item" />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[['All', ''], ['In', 'IN'], ['Out', 'OUT']].map(([l, v]) => <Chip key={l} label={l} selected={type === v} onPress={() => setType(v)} />)}
      </View>
      {!itemId ? null : (logs.data || []).length === 0 ? <EmptyState text="No stock movement yet." /> : logs.data.map((l) => (
        <ListRow key={l.id} avatar={null} title={`${l.type} ${l.quantity}`} subtitle={l.date}
          right={<Icon name={l.type === 'IN' ? 'arrow-down' : 'arrow-up'} size={20} color={l.type === 'IN' ? t.colors.success : t.colors.danger} />} />
      ))}
    </Card>
  );
}
