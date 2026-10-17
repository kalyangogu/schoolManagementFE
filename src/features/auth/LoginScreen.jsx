import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, TextField, useToast } from '../../components/ui';
import { useStyles } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { activeSchool } from '../../config/schools';
import { USE_MOCK } from '../../services/api';
import { isValidPhone } from '../../utils/format';

export default function LoginScreen() {
  const s = useStyles(makeStyles);
  const { requestOtp, verifyOtp } = useAuth();
  const toast = useToast();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('mobile'); // mobile | otp
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const sendCode = async () => {
    if (!isValidPhone(mobile)) return setError('Enter your 10 digit mobile number');
    setError(''); setBusy(true);
    try { await requestOtp(mobile); setStep('otp'); toast.success('Code sent to your mobile'); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const verify = async () => {
    if (otp.length !== 6) return setError('Enter the 6 digit code');
    setError(''); setBusy(true);
    try { await verifyOtp(mobile, otp); } // navigator switches to Home automatically
    catch (e) { setError(e.message); setBusy(false); }
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
            <Text style={s.hello}>{step === 'mobile' ? 'Welcome back 👋' : 'Check your messages'}</Text>
            <Text style={s.help}>
              {step === 'mobile' ? 'Enter the mobile number registered with your school.' : `We sent a 6 digit code to +91 ${mobile}.`}
            </Text>

            {step === 'mobile' ? (
              <TextField
                label="Mobile number" prefix="+91" placeholder="10 digit mobile number" keyboardType="number-pad" maxLength={10}
                value={mobile} onChangeText={(v) => { setMobile(v.replace(/\D/g, '')); setError(''); }} error={error}
              />
            ) : (
              <TextField
                label="Verification code" placeholder="6 digit code" keyboardType="number-pad" maxLength={6}
                value={otp} onChangeText={(v) => { setOtp(v.replace(/\D/g, '')); setError(''); }} error={error}
                hint={USE_MOCK ? 'Demo mode: use 123456' : undefined}
              />
            )}

            <Button title={step === 'mobile' ? 'Send code' : 'Verify and log in'} icon={step === 'mobile' ? 'send-outline' : 'log-in-outline'} loading={busy} onPress={step === 'mobile' ? sendCode : verify} />

            {step === 'otp' ? (
              <Pressable onPress={() => { setStep('mobile'); setOtp(''); setError(''); }} style={{ alignSelf: 'center', padding: 6 }}>
                <Text style={s.link}>Use a different number</Text>
              </Pressable>
            ) : null}
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
    logo: { width: 84, height: 84, borderRadius: t.radius.xl, backgroundColor: t.colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    logoText: { fontSize: 30, fontWeight: '800', color: t.colors.primary },
    school: { fontSize: t.fontSize.xl, fontWeight: '800', color: '#fff', textAlign: 'center' },
    tagline: { fontSize: t.fontSize.md, color: 'rgba(255,255,255,0.75)' },
    card: { padding: t.spacing.xl, gap: t.spacing.lg },
    hello: { fontSize: t.fontSize.xl, fontWeight: '800', color: t.colors.text },
    help: { fontSize: t.fontSize.sm + 1, color: t.colors.textMuted, marginTop: -8, lineHeight: 20 },
    link: { color: t.colors.primary, fontWeight: '700' },
  });
