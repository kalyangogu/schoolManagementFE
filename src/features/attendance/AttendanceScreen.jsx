import React, { useState } from 'react';
import { Screen, SegmentedTabs } from '../../components/ui';
import MarkAttendance from './MarkAttendance';
import AbsentList from './AbsentList';
import StudentReport from './StudentReport';
import Summary from './Summary';

const TABS = [
  { key: 'mark', label: 'Mark' },
  { key: 'absent', label: 'Absent' },
  { key: 'student', label: 'Student' },
  { key: 'summary', label: 'Summary' },
];
const VIEWS = { mark: MarkAttendance, absent: AbsentList, student: StudentReport, summary: Summary };

export default function AttendanceScreen({ navigation }) {
  const [tab, setTab] = useState('mark');
  const Active = VIEWS[tab];
  return (
    <Screen title="Attendance" subtitle="Daily attendance and reports" onBack={navigation.goBack}>
      <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />
      <Active />
    </Screen>
  );
}
