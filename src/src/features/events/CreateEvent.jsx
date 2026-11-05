import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Card, TextField, DateField, Chip, Button, Icon, useToast } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync from '../../hooks/useAsync';
import useAction from '../../hooks/useAction';
import { api } from '../../services/api';
import { todayISO } from '../../utils/format';

export default function CreateEvent({ onDone }) {
  const t = useTheme();
  const toast = useToast();
  const [name, setName] = useState('');
  const [date, setDate] = useState(todayISO());
  const [summary, setSummary] = useState('');
  const [classIds, setClassIds] = useState([]);
  const [photos, setPhotos] = useState([]); // local URIs
  const classes = useAsync(() => api.classes.list());
  const [save, saving] = useAction(api.events.create, 'Event uploaded');

  useEffect(() => { if (classes.data && classIds.length === 0) setClassIds(classes.data.map((c) => c.id)); }, [classes.data]);

  const toggle = (id) => setClassIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const pick = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: true, selectionLimit: 10, quality: 0.7 });
      if (!res.canceled) setPhotos((p) => [...p, ...res.assets.map((a) => a.uri)].slice(0, 10));
    } catch (e) {
      toast.error('Could not open your photos');
    }
  };

  const submit = async () => {
    const { ok } = await save({ name, date, summary, classIds, photos });
    if (ok) onDone();
  };

  return (
    <Card title="New event" subtitle="Share photos with the classes you choose.">
      <TextField label="Event name" required placeholder="Example: Annual Day" value={name} onChangeText={setName} />
      <DateField label="Date" value={date} onChange={setDate} />
      <TextField label="Summary" multiline placeholder="Event summary" value={summary} onChangeText={setSummary} />

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flex: 1, fontWeight: '600', color: t.colors.text }}>Visible classes</Text>
        <Pressable onPress={() => setClassIds((classes.data || []).map((c) => c.id))} style={{ padding: 6 }}><Text style={{ color: t.colors.primary, fontWeight: '700' }}>All</Text></Pressable>
        <Pressable onPress={() => setClassIds([])} style={{ padding: 6 }}><Text style={{ color: t.colors.primary, fontWeight: '700' }}>Clear</Text></Pressable>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {(classes.data || []).map((c) => <Chip key={c.id} label={c.name} selected={classIds.includes(c.id)} onPress={() => toggle(c.id)} />)}
      </View>

      {photos.length > 0 ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {photos.map((uri, i) => (
            <View key={`${uri}-${i}`}>
              <Image source={{ uri }} style={{ width: 72, height: 72, borderRadius: t.radius.sm }} />
              <Pressable onPress={() => setPhotos((p) => p.filter((_, j) => j !== i))} style={{ position: 'absolute', top: -6, right: -6 }} accessibilityLabel="Remove photo">
                <Icon name="close-circle" size={22} color={t.colors.danger} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
      <Button variant="outline" icon="image-plus" title={photos.length ? `Choose more photos (${photos.length}/10)` : 'Choose photos'} onPress={pick} />
      <Button title="Upload event" icon="cloud-upload-outline" loading={saving} disabled={!name.trim() || classIds.length === 0} onPress={submit} />
    </Card>
  );
}
