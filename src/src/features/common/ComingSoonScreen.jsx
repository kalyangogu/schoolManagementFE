import React from 'react';
import { Screen, Card, EmptyState } from '../../components/ui';

// Placeholder for modules that are in the registry but not built yet.
export default function ComingSoonScreen({ navigation, route }) {
  return (
    <Screen title={route.name.replace(/([a-z])([A-Z])/g, '$1 $2')} subtitle="Coming soon" onBack={navigation.goBack}>
      <Card>
        <EmptyState icon="construct-outline" text="This section is next on the list. The screen, route and menu tile are already wired up." />
      </Card>
    </Screen>
  );
}
