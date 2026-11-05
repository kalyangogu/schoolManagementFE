import React, { useState } from 'react';
import { Screen, SegmentedTabs } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import EventGallery from './EventGallery';
import CreateEvent from './CreateEvent';

export default function EventsScreen({ navigation }) {
  const { activeProfile } = useAuth();
  const canCreate = activeProfile.role === 'SCHOOL_ADMIN' || activeProfile.role === 'TEACHER';
  const [tab, setTab] = useState('gallery');
  // bump to refresh the gallery after a new event is created
  const [version, setVersion] = useState(0);

  return (
    <Screen title="Events" subtitle="School media" onBack={navigation.goBack}>
      {canCreate ? (
        <SegmentedTabs tabs={[{ key: 'gallery', label: 'Gallery', icon: 'image-multiple-outline' }, { key: 'create', label: 'Create', icon: 'image-plus' }]} value={tab} onChange={setTab} />
      ) : null}
      {tab === 'gallery' ? <EventGallery version={version} /> : <CreateEvent onDone={() => { setVersion((v) => v + 1); setTab('gallery'); }} />}
    </Screen>
  );
}
