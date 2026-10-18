import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ─────────────────────────────────────────────────────────────────────────────
// The ONLY file that knows which icon pack the app uses.
// Screens use the app's own names (left). To change the look of every icon in the
// app, edit the right-hand side, or swap the pack imported above.
// A name that is not listed here is passed straight to the pack, so any
// MaterialCommunityIcons name also works (https://pictogrammers.com/library/mdi/).
// ─────────────────────────────────────────────────────────────────────────────
const ICONS = {
  // navigation & actions
  add: 'plus',
  'arrow-back': 'arrow-left',
  'arrow-down': 'arrow-down',
  'arrow-up': 'arrow-up',
  'chevron-back': 'chevron-left',
  'chevron-forward': 'chevron-right',
  'chevron-down': 'chevron-down',
  'chevron-up': 'chevron-up',
  close: 'close',
  checkmark: 'check',
  'search-outline': 'magnify',
  'send-outline': 'send-outline',
  'log-in-outline': 'login',
  'log-out-outline': 'logout',
  // status
  'alert-circle': 'alert-circle',
  'alert-circle-outline': 'alert-circle-outline',
  'checkmark-circle': 'check-circle',
  'checkmark-circle-outline': 'check-circle-outline',
  'information-circle-outline': 'information-outline',
  checkbox: 'checkbox-marked',
  'square-outline': 'checkbox-blank-outline',
  'happy-outline': 'emoticon-happy-outline',
  'construct-outline': 'hammer-wrench',
  'file-tray-outline': 'inbox-outline',
  // people
  'people-outline': 'account-group-outline',
  'person-outline': 'account-outline',
  'person-add-outline': 'account-plus-outline',
  'person-remove-outline': 'account-off-outline',
  'shield-checkmark-outline': 'shield-account-outline',
  'id-card-outline': 'card-account-details-outline',
  // modules
  'book-outline': 'book-open-page-variant-outline',
  'cash-outline': 'cash-multiple',
  'checkmark-done-outline': 'clipboard-check-outline',
  'journal-outline': 'notebook-outline',
  'cube-outline': 'package-variant-closed',
  'school-outline': 'school-outline',
  'megaphone-outline': 'bullhorn-outline',
  'calendar-outline': 'calendar-month-outline',
  'chatbubble-ellipses-outline': 'message-text-outline',
  'pricetag-outline': 'tag-outline',
  'receipt-outline': 'receipt-text-outline',
  'stats-chart-outline': 'chart-box-outline',
  'time-outline': 'clock-outline',
};

export default function Icon({ name, size = 20, color, style }) {
  return <MaterialCommunityIcons name={ICONS[name] || name} size={size} color={color} style={style} />;
}
