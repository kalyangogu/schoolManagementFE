import React, { useState } from 'react';
import { View, Text, Image, Pressable, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, ListRow, Icon, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme';
import useAsync from '../../hooks/useAsync';
import { api } from '../../services/api';
import { prettyDate } from '../../utils/format';

export default function EventGallery({ version }) {
  const t = useTheme();
  const [openId, setOpenId] = useState(null);
  const [viewer, setViewer] = useState(null);
  const list = useAsync(() => api.events.list(), [version]);
  const detail = useAsync(() => (openId ? api.events.get({ id: openId }) : Promise.resolve(null)), [openId]);

  if (openId) {
    const e = detail.data;
    const size = (Dimensions.get('window').width - 32 - 32 - 10) / 2;
    return (
      <Card>
        <Pressable onPress={() => setOpenId(null)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="arrow-back" size={18} color={t.colors.primary} />
          <Text style={{ color: t.colors.primary, fontWeight: '700' }}>All events</Text>
        </Pressable>
        {!e ? <EmptyState loading /> : (
          <>
            <Text style={{ fontSize: t.fontSize.xxl - 4, fontWeight: '800', color: t.colors.text }}>{e.name}</Text>
            <Text style={{ color: t.colors.textMuted }}>{prettyDate(e.date)}</Text>
            {e.summary ? <Text style={{ color: t.colors.text, lineHeight: 21 }}>{e.summary}</Text> : null}
            {e.photos.length === 0 ? <EmptyState icon="image-off-outline" text="No photos were added to this event." /> : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {e.photos.map((uri, i) => (
                  <Pressable key={`${uri}-${i}`} onPress={() => setViewer(uri)}>
                    <Image source={{ uri }} style={{ width: size, height: size, borderRadius: t.radius.md, backgroundColor: t.colors.primaryTint }} />
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
        <Modal visible={!!viewer} transparent animationType="fade" onRequestClose={() => setViewer(null)}>
          <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.94)' }}>
            <Pressable onPress={() => setViewer(null)} style={{ alignSelf: 'flex-end', padding: 16 }} accessibilityLabel="Close photo">
              <Icon name="close" size={28} color="#fff" />
            </Pressable>
            {viewer ? <Image source={{ uri: viewer }} resizeMode="contain" style={{ flex: 1 }} /> : null}
          </SafeAreaView>
        </Modal>
      </Card>
    );
  }

  return !list.data ? <EmptyState loading /> : list.data.length === 0 ? <EmptyState icon="calendar-outline" text="No events yet." /> : (
    <>
      {list.data.map((e) => (
        <ListRow key={e.id} icon="party-popper" title={e.name} subtitle={`${prettyDate(e.date)} · ${e.photoCount} photo(s)`} onPress={() => setOpenId(e.id)} />
      ))}
    </>
  );
}
