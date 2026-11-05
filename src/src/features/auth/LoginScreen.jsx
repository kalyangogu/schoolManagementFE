import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, TextField, Banner, Icon, useToast } from '../../components/ui';
import { useStyles, useTheme } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { activeSchool } from '../../config/schools';
import { USE_MOCK } from '../../services/api';
import { isValidEmail } from '../../utils/format';
import AccountTypeSelector from './AccountTypeSelector';
import { accountType } from './accountTypes';

export default function LoginScreen({ navigation }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  const { login, requestOtp, verifyOtp } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState('password'); // password | otp
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // ID + password
  const [account, setAccount] = useState('STUDENT');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  // OTP
  const [otpId, setOtpId] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const type = accountType(account);
  const switchMode = (m) => { setMode(m); setError(''); };

  const submitPassword = async () => {
    if (!identifier.trim()) return setError(`Enter your ${type.idLabel.toLowerCase()}`);
    if (type.email && !isValidEmail(identifier)) return setError('Enter a valid email address');
    if (!password) return setError('Enter your password');
    setError(''); setBusy(true);
    try { await login({ account, identifier, password }); }
    catch (e) { setError(e.message || 'Unable to log in'); setBusy(false); }
  };

  const sendOtp = async () => {
    if (!otpId.trim()) return setError('Enter your email or mobile number');
    setError(''); setBusy(true);
    try { await requestOtp(otpId.trim()); setOtpSent(true); toast.success('Code sent'); }
    catch (e) { setError(e.message || 'Unable to send the code'); }
    finally { setBusy(false); }
  };

  const verify = async () => {
    if (otp.length !== 6) return setError('Enter the 6 digit code');
    setError(''); setBusy(true);
    try { await verifyOtp(otpId.trim(), otp); }
    catch (e) { setError(e.message || 'That code is not correct'); setBusy(false); }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={s.hero}>
            <View style={s.logo}><Text style={s.logoText}>{activeSchool.logoText}</Text></View>
            <Text style={s.school}>{activeSchool.displayName}</Text>
            <Text style={s.tagline}>{activeSchool.tagline}</Text>
          </View>

          <Card style={s.card}>
            <Text style={s.hello}>Welcome back 👋</Text>

            <View style={s.toggle}>
              {[['password', 'ID & Password', 'lock-outline'], ['otp', 'OTP', 'message-processing-outline']].map(([key, label, icon]) => {
                const on = mode === key;
                return (
                  <Pressable key={key} onPress={() => switchMode(key)} style={[s.toggleBtn, on && s.toggleOn]}>
                    <Icon name={icon} size={17} color={on ? t.colors.onPrimary : t.colors.textMuted} />
                    <Text style={[s.toggleText, on && { color: t.colors.onPrimary }]}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {error ? <Banner tone="danger" text={error} /> : null}

            {mode === 'password' ? (
              <>
                <Text style={s.label}>I am a</Text>
                <AccountTypeSelector value={account} onChange={(a) => { setAccount(a); setIdentifier(''); setError(''); }} />
                <TextField
                  label={type.idLabel} placeholder={type.idPlaceholder} icon="account-outline" keyboardType={type.keyboard}
                  autoCapitalize="none" autoCorrect={false} value={identifier} onChangeText={(v) => { setIdentifier(v); setError(''); }}
                />
                <TextField
                  label="Password" placeholder="Enter your password" icon="lock-outline" secureTextEntry={!showPw}
                  autoCapitalize="none" autoCorrect={false} value={password} onChangeText={(v) => { setPassword(v); setError(''); }}
                  right={
                    <Pressable onPress={() => setShowPw((x) => !x)} hitSlop={10} accessibilityLabel={showPw ? 'Hide password' : 'Show password'}>
                      <Icon name={showPw ? 'eye-off-outline' : 'eye-outline'} size={22} color={t.colors.textMuted} />
                    </Pressable>
                  }
                />
                <Button title="Log in" icon="log-in-outline" loading={busy} onPress={submitPassword} />
                <Pressable onPress={() => navigation.navigate('ForgotPassword', { account })} style={s.linkWrap}>
                  <Text style={s.link}>Forgot password?</Text>
                </Pressable>
                {USE_MOCK ? <Text style={s.demo}>Demo: ADM001 / student123 · admin@school.com / admin123 · parent@mail.com / parent123</Text> : null}
              </>
            ) : (
              <>
                <Banner tone="info" text="OTP login is for staff and parents. Students log in with their admission number and password." />
                <TextField
                  label="Email or mobile number" placeholder="Registered email or mobile" icon="email-outline" autoCapitalize="none" autoCorrect={false}
                  value={otpId} editable={!otpSent} onChangeText={(v) => { setOtpId(v); setError(''); }}
                />
                {otpSent ? (
                  <TextField
                    label="Verification code" placeholder="6 digit code" icon="dialpad" keyboardType="number-pad" maxLength={6}
                    value={otp} onChangeText={(v) => { setOtp(v.replace(/\D/g, '')); setError(''); }}
                    hint={USE_MOCK ? 'Demo: admin@school.com and code 123456' : undefined}
                  />
                ) : null}
                <Button title={otpSent ? 'Verify and log in' : 'Send code'} icon={otpSent ? 'log-in-outline' : 'send-outline'} loading={busy} onPress={otpSent ? verify : sendOtp} />
                {otpSent ? (
                  <Pressable onPress={() => { setOtpSent(false); setOtp(''); setError(''); }} style={s.linkWrap}>
                    <Text style={s.link}>Change email / mobile</Text>
                  </Pressable>
                ) : null}
              </>
            )}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.colors.primaryDark },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: t.spacing.lg, gap: t.spacing.xl },
    hero: { alignItems: 'center', gap: 6 },
    logo: { width: 76, height: 76, borderRadius: t.radius.xl, backgroundColor: t.colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
    logoText: { fontSize: 28, fontWeight: '800', color: t.colors.primary },
    school: { fontSize: t.fontSize.xl, fontWeight: '800', color: '#fff', textAlign: 'center' },
    tagline: { fontSize: t.fontSize.md, color: 'rgba(255,255,255,0.75)' },
    card: { padding: t.spacing.xl, gap: t.spacing.lg },
    hello: { fontSize: t.fontSize.xl, fontWeight: '800', color: t.colors.text },
    toggle: { flexDirection: 'row', backgroundColor: t.colors.background, borderRadius: t.radius.md, padding: 4 },
    toggleBtn: { flex: 1, minHeight: 44, borderRadius: t.radius.sm + 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
    toggleOn: { backgroundColor: t.colors.primary },
    toggleText: { fontSize: t.fontSize.sm + 1, fontWeight: '700', color: t.colors.textMuted },
    label: { fontSize: t.fontSize.sm, fontWeight: '600', color: t.colors.text, marginBottom: -6 },
    linkWrap: { alignSelf: 'center', padding: 6 },
    link: { color: t.colors.primary, fontWeight: '700' },
    demo: { fontSize: t.fontSize.xs, color: t.colors.textMuted, textAlign: 'center', lineHeight: 16 },
  });
