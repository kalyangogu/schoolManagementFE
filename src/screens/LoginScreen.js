import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import LoadingOverlay from "../components/LoadingOverlay";
import { useToast } from "../components/Toast";
import { useAuth } from "../state/store";
import { sendOtp, verifyOtp } from "../services/api";
import { colors } from "../styles/colors";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const validateIdentifier = () => {
    const trimmed = identifier.trim();
    if (!trimmed) return "Please enter your email or mobile number";
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    const isMobile = /^[0-9]{10}$/.test(trimmed);
    if (!isEmail && !isMobile) {
      return "Enter a valid email or 10-digit mobile number";
    }
    return null;
  };

  const validateOtp = () => {
    if (!/^[0-9]{6}$/.test(otp.trim())) {
      return "OTP must be 6 digits";
    }
    return null;
  };

  const handleSendOtp = async () => {
    const error = validateIdentifier();
    if (error) {
      showError(error);
      return;
    }
    setLoading(true);
    try {
      await sendOtp(identifier.trim());
      showSuccess("OTP sent successfully. Please check your email/mobile.");
      setStep(2);
    } catch (err) {
      showError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const error = validateOtp();
    if (error) {
      showError(error);
      return;
    }
    setLoading(true);
    try {
      const data = await verifyOtp(identifier.trim(), otp.trim());
      const roles = data.roles || (data.user && data.user.roles) || [];
      login(data.user, roles);
      showSuccess("Login successful!");
      navigation.replace("RoleSelection");
    } catch (err) {
      showError(err.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setOtp("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LoadingOverlay visible={loading} message="Please wait..." />

      <View style={styles.card}>
        <AppText variant="heading" style={styles.title}>
          Login
        </AppText>

        {step === 1 ? (
          <>
            <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
              Enter your email or mobile number to receive a one-time password (OTP)
            </AppText>
            <AppTextInput
              label="Email or Mobile Number"
              placeholder="e.g. you@example.com or 9876543210"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="person-outline" size={20} color={colors.textMuted} />}
            />
            <AppButton
              title="Send OTP"
              onPress={handleSendOtp}
              loading={loading}
            />
          </>
        ) : (
          <>
            <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
              We sent a 6-digit OTP to: {identifier.trim()}
            </AppText>
            <AppTextInput
              label="OTP"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              leftIcon={<Ionicons name="key-outline" size={20} color={colors.textMuted} />}
            />
            <AppButton
              title="Verify OTP & Login"
              onPress={handleVerifyOtp}
              loading={loading}
            />
            <TouchableOpacity onPress={handleBack} style={styles.backLink}>
              <AppText variant="bodyMedium" color={colors.primary}>
                Change email/mobile
              </AppText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  backLink: {
    marginTop: 16,
    alignItems: "center",
  },
});
