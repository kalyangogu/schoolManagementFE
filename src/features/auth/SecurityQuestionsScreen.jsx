import React, { useState } from 'react';
import { Screen, Card, TextField, Button, Banner } from '../../components/ui';
import useAction from '../../hooks/useAction';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { SECURITY_QUESTIONS } from '../../config/securityQuestions';

// Students only. These answers are checked by "Forgot password" on the login screen.
export default function SecurityQuestionsScreen({ navigation }) {
  const { loginId } = useAuth();
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [save, saving] = useAction(api.auth.studentSetSecurityQuestions, 'Security questions saved');

  const submit = async () => {
    if (SECURITY_QUESTIONS.some((q) => (answers[q.id] || '').trim().length < 2)) return setError('Please answer every question');
    setError('');
    const { ok } = await save({ admissionNumber: loginId, answers: SECURITY_QUESTIONS.map((q) => ({ questionId: q.id, answer: answers[q.id] })) });
    if (ok) navigation.goBack();
  };

  return (
    <Screen title="Security questions" subtitle="Used to reset your password" onBack={navigation.goBack}>
      <Banner text="Answer these questions with things only you know. If you forget your password, you will answer them again to set a new one. Remember your answers." />
      {error ? <Banner tone="danger" text={error} /> : null}
      <Card>
        {SECURITY_QUESTIONS.map((q, i) => (
          <TextField key={q.id} label={`${i + 1}. ${q.text}`} placeholder="Your answer" autoCapitalize="none" autoCorrect={false} value={answers[q.id] || ''} onChangeText={(v) => { setAnswers((a) => ({ ...a, [q.id]: v })); setError(''); }} />
        ))}
        <Button title="Save security questions" icon="shield-check-outline" loading={saving} onPress={submit} />
      </Card>
    </Screen>
  );
}
