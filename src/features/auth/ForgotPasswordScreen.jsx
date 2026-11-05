import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Screen, Card, TextField, Button, Banner, Icon, useToast } from '../../components/ui';
import { useTheme } from '../../theme';
import { api, USE_MOCK } from '../../services/api';
import { SECURITY_QUESTIONS } from '../../config/securityQuestions';
import { isValidEmail, isValidPassword, PASSWORD_MIN } from '../../utils/format';
import AccountTypeSelector from './AccountTypeSelector';
import { accountType } from './accountTypes';

// STUDENT:        1 admission number → 2 security questions → 3 new password
// STAFF / PARENT: 1 email or user ID → 2 code + new password
export default function ForgotPasswordScreen({ navigation, route }) {
  const t = useTheme();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState((route.params && route.params.account) || 'STUDENT');
  const [identifier, setIdentifier] = useState('');
  const [answers, setAnswers] = useState({}); // questionId -> text
  const [resetToken, setResetToken] = useState(null);
  const [code, setCode] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isStudent = account === 'STUDENT';
  const total = isStudent ? 3 : 2;
  const type = accountType(account);
  const clear = () => setError('');
  const run = async (fn) => {
    clear(); setBusy(true);
    try { await fn(); } catch (e) { setError(e.message || 'Something went wrong'); } finally { setBusy(false); }
  };
  const checkPasswords = () => {
    if (!isValidPassword(pw)) { setError(`Password must be at least ${PASSWORD_MIN} characters`); return false; }
    if (pw !== pw2) { setError('The two passwords do not match'); return false; }
    return true;
  };
  const finish = () => { toast.success('Password changed. Please log in.'); navigation.goBack(); };

  // Step 1
  const next1 = () => {
    if (!identifier.trim()) return setError(`Enter your ${type.idLabel.toLowerCase()}`);
    if (type.email && !isValidEmail(identifier)) return setError('Enter a valid email address');
    if (isStudent) { clear(); setStep(2); return undefined; } // the questions are the same for every student
    return run(async () => { await api.auth.forgotRequest({ identifier: identifier.trim() }); setCode(''); setStep(2); });
  };

  // Student step 2
  const verifyAnswers = () => {
    if (SECURITY_QUESTIONS.some((q) => !(answers[q.id] || '').trim())) return setError('Please answer every question');
    return run(async () => {
      const res = await api.auth.studentVerifyAnswers({ admissionNumber: identifier.trim(), answers: SECURITY_QUESTIONS.map((q) => ({ questionId: q.id, answer: answers[q.id] })) });
      setResetToken(res.resetToken || res.token); setStep(3);
    });
  };

  // Student step 3
  const resetStudent = () => {
    if (!checkPasswords()) return undefined;
    return run(async () => { await api.auth.studentResetPassword({ admissionNumber: identifier.trim(), resetToken, newPassword: pw }); finish(); });
  };

  // Staff/parent step 2
  const resetOther = () => {
    if (!code.trim()) return setError('Enter the code we sent you');
    if (!checkPasswords()) return undefined;
    return run(async () => { await api.auth.forgotReset({ identifier: identifier.trim(), code: code.trim(), newPassword: pw }); finish(); });
  };

  const back = () => { if (step === 1) navigation.goBack(); else { clear(); setStep(step - 1); } };
  const titles = isStudent ? ['Find your account', 'Answer your security questions', 'Choose a new password'] : ['Find your account', 'Enter the code and a new password'];

  const passwordFields = (
    <>
      <TextField label="New password" icon="lock-outline" secureTextEntry autoCapitalize="none" placeholder={`At least ${PASSWORD_MIN} characters`} value={pw} onChangeText={(v) => { setPw(v); clear(); }} />
      <TextField label="Confirm new password" icon="lock-check-outline" secureTextEntry autoCapitalize="none" placeholder="Type it again" value={pw2} onChangeText={(v) => { setPw2(v); clear(); }} />
    </>
  );

  return (
    <Screen title="Forgot password" subtitle={`Step ${step} of ${total}`} onBack={back}>
      <Card title={titles[step - 1]}>
        {error ? <Banner tone="danger" text={error} /> : null}

        {step === 1 ? (
          <>
            <AccountTypeSelector value={account} onChange={(a) => { setAccount(a); setIdentifier(''); clear(); }} />
            <TextField label={type.idLabel} placeholder={type.idPlaceholder} icon="account-outline" keyboardType={type.keyboard} autoCapitalize="none" autoCorrect={false} value={identifier} onChangeText={(v) => { setIdentifier(v); clear(); }} />
            <Button title="Continue" icon="chevron-forward" loading={busy} onPress={next1} />
          </>
        ) : null}

        {step === 2 && isStudent ? (
          <>
            <Banner tone="info" text="Answer the questions exactly as you set them up in the app." />
            {SECURITY_QUESTIONS.map((q, i) => (
              <TextField key={q.id} label={`${i + 1}. ${q.text}`} placeholder="Your answer" autoCapitalize="none" autoCorrect={false} value={answers[q.id] || ''} onChangeText={(v) => { setAnswers((a) => ({ ...a, [q.id]: v })); clear(); }} />
            ))}
            <Button title="Verify answers" icon="shield-check-outline" loading={busy} onPress={verifyAnswers} />
          </>
        ) : null}

        {step === 3 && isStudent ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="check-circle" size={20} color={t.colors.success} />
              <Text style={{ color: t.colors.success, fontWeight: '700' }}>Answers verified</Text>
            </View>
            {passwordFields}
            <Button title="Change password" icon="check" loading={busy} onPress={resetStudent} />
          </>
        ) : null}

        {step === 2 && !isStudent ? (
          <>
            <Banner tone="info" text={`If an account exists for ${identifier.trim()}, a code has been sent to it. If nothing arrives, ask your school admin to reset your password.`} />
            <TextField label="Code" icon="dialpad" placeholder="Code you received" keyboardType="number-pad" value={code} onChangeText={(v) => { setCode(v); clear(); }} hint={USE_MOCK ? 'Demo: use 123456' : undefined} />
            {passwordFields}
            <Button title="Change password" icon="check" loading={busy} onPress={resetOther} />
          </>
        ) : null}
      </Card>
    </Screen>
  );
}
