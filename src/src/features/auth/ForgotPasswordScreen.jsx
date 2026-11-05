import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Screen, Card, TextField, Button, Banner, Icon, useToast } from '../../components/ui';
import { useTheme } from '../../theme';
import { api, USE_MOCK } from '../../services/api';
import { isValidEmail, isValidPassword, PASSWORD_MIN } from '../../utils/format';
import AccountTypeSelector from './AccountTypeSelector';
import { accountType } from './accountTypes';
import QuestionPicker, { emptyPicks, picksError, toAnswers } from './QuestionPicker';

// Turn the backend's messages into something a student can act on.
const friendly = (m) => {
  if (/was not set for this student/i.test(m)) return 'Those are not the questions you chose earlier. Pick the same 3 questions you chose when you set them up.';
  if (/not configured/i.test(m)) return 'You have not set up security questions. Please ask your school admin to reset your password.';
  if (/incorrect/i.test(m)) return 'One or more answers are not correct. If you cannot remember them, ask your school admin to reset your password.';
  return m;
};

// STUDENT:        1 admission number → 2 pick 3 questions + answer → 3 new password
// STAFF / PARENT: 1 email or user ID → 2 OTP + new password
export default function ForgotPasswordScreen({ navigation, route }) {
  const t = useTheme();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState((route.params && route.params.account) || 'STUDENT');
  const [identifier, setIdentifier] = useState('');
  const [picks, setPicks] = useState(emptyPicks());
  const [code, setCode] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isStudent = account === 'STUDENT';
  const total = isStudent ? 3 : 2;
  const type = accountType(account);
  const id = identifier.trim();
  const clear = () => setError('');
  const run = async (fn) => {
    clear(); setBusy(true);
    try { await fn(); } catch (e) { setError(friendly(e.message || 'Something went wrong')); } finally { setBusy(false); }
  };
  const checkPasswords = () => {
    if (!isValidPassword(pw)) { setError(`Password must be at least ${PASSWORD_MIN} characters`); return false; }
    if (pw !== pw2) { setError('The two passwords do not match'); return false; }
    return true;
  };

  // Step 1
  const next1 = () => {
    if (!id) return setError(`Enter your ${type.idLabel.toLowerCase()}`);
    if (type.email && !isValidEmail(id)) return setError('Enter a valid email address');
    if (isStudent) { clear(); setStep(2); return undefined; }
    return run(async () => { await api.auth.forgotRequest({ identifier: id }); setCode(''); setStep(2); });
  };

  // Student step 2: check the answers now so a wrong guess is caught before choosing a password
  const verifyAnswers = () => {
    const problem = picksError(picks);
    if (problem) return setError(problem);
    return run(async () => { await api.auth.studentVerifyAnswers({ loginId: id, answers: toAnswers(picks) }); setStep(3); });
  };

  // Student step 3 (the backend wants the answers again with the new password)
  const resetStudent = () => {
    if (!checkPasswords()) return undefined;
    return run(async () => {
      await api.auth.studentResetPassword({ loginId: id, answers: toAnswers(picks), newPassword: pw });
      toast.success('Password changed. Log in, then set your security questions again.');
      navigation.goBack();
    });
  };

  // Staff / parent step 2
  const resetOther = () => {
    if (!code.trim()) return setError('Enter the OTP we sent you');
    if (!checkPasswords()) return undefined;
    return run(async () => {
      await api.auth.forgotReset({ identifier: id, code: code.trim(), newPassword: pw });
      toast.success('Password changed. Please log in.');
      navigation.goBack();
    });
  };

  const back = () => { if (step === 1) navigation.goBack(); else { clear(); setStep(step - 1); } };
  const titles = isStudent ? ['Find your account', 'Answer your security questions', 'Choose a new password'] : ['Find your account', 'Enter the OTP and a new password'];

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
            {isStudent ? <Banner tone="info" text="Students reset their password with the security questions they set up. If you never set them, or cannot remember the answers, ask your school admin to reset it." /> : null}
            <Button title="Continue" icon="chevron-forward" loading={busy} onPress={next1} />
          </>
        ) : null}

        {step === 2 && isStudent ? (
          <>
            <Banner tone="info" text="Choose the same 3 questions you picked when you set them up, and give the same answers." />
            <QuestionPicker value={picks} onChange={(v) => { setPicks(v); clear(); }} />
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
            <Banner tone="info" text={`We sent an OTP to ${id}. If it does not arrive, ask your school admin to reset your password.`} />
            <TextField label="OTP" icon="dialpad" placeholder="6 digit OTP" keyboardType="number-pad" maxLength={6} value={code} onChangeText={(v) => { setCode(v.replace(/\D/g, '')); clear(); }} hint={USE_MOCK ? 'Demo: use 123456' : undefined} />
            {passwordFields}
            <Button title="Change password" icon="check" loading={busy} onPress={resetOther} />
          </>
        ) : null}
      </Card>
    </Screen>
  );
}
