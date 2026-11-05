import React, { useState } from 'react';
import { Screen, Card, Button, Banner } from '../../components/ui';
import useAction from '../../hooks/useAction';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { SECURITY_QUESTION_COUNT } from '../../config/securityQuestions';
import QuestionPicker, { emptyPicks, picksError, toAnswers } from './QuestionPicker';

// Students pick 3 of the 6 questions. Saving again replaces the old ones.
export default function SecurityQuestionsScreen({ navigation }) {
  const { loginId } = useAuth();
  const [picks, setPicks] = useState(emptyPicks());
  const [error, setError] = useState('');
  const [save, saving] = useAction(api.auth.studentSetSecurityQuestions, 'Security questions saved');

  const submit = async () => {
    const problem = picksError(picks);
    if (problem) return setError(problem);
    setError('');
    const { ok } = await save({ loginId, answers: toAnswers(picks) });
    if (ok) navigation.goBack();
  };

  return (
    <Screen title="Security questions" subtitle="Used to reset your password" onBack={navigation.goBack}>
      <Banner text={`Choose ${SECURITY_QUESTION_COUNT} questions and answer them. If you forget your password you will need to pick the same questions and give the same answers, so remember which ones you chose. If you forget them, your school admin can reset your password.`} />
      {error ? <Banner tone="danger" text={error} /> : null}
      <Card>
        <QuestionPicker value={picks} onChange={(v) => { setPicks(v); setError(''); }} />
        <Button title="Save security questions" icon="shield-check-outline" loading={saving} onPress={submit} />
      </Card>
    </Screen>
  );
}
