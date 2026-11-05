import React, { useState } from 'react';
import { Screen, SegmentedTabs, Banner } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import PlanExams from './PlanExams';
import EnterMarks from './EnterMarks';
import Results from './Results';
import ExamSetup from './ExamSetup';

const ALL_TABS = [
  { key: 'plan', label: 'Plan exams', View: PlanExams, hint: 'First choose an exam group and class. Then select subjects and dates.' },
  { key: 'marks', label: 'Enter marks', View: EnterMarks, hint: 'Choose the exam and enter marks for students in the selected class.' },
  { key: 'results', label: 'See results', View: Results, hint: 'Choose an exam group and class to see the recorded results.' },
  { key: 'setup', label: 'Exam setup', View: ExamSetup, hint: 'Create an exam group such as Unit Test, Mid Term, or Final Exam.' },
];

export default function ExamsScreen({ navigation }) {
  const { activeProfile } = useAuth();
  // Students and parents can only look at results.
  const tabs = ['STUDENT', 'PARENT'].includes(activeProfile.role) ? ALL_TABS.filter((t) => t.key === 'results') : ALL_TABS;
  const [tab, setTab] = useState(tabs[0].key);
  const active = tabs.find((t) => t.key === tab) || tabs[0];
  const Active = active.View;
  return (
    <Screen title="Exams" subtitle="Plan exams and enter marks" onBack={navigation.goBack}>
      {tabs.length > 1 ? <SegmentedTabs tabs={tabs} value={active.key} onChange={setTab} /> : null}
      <Banner text={active.hint} />
      <Active />
    </Screen>
  );
}
