
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../state/store";

export default function LoginScreen() {
  const { login } = useAuth();

  // Login mode
  const [loginMode, setLoginMode] = useState("password");

  // Password login
  const [admissionId, setAdmissionId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP login
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // PASSWORD LOGIN
  // --------------------------------------------------

  const handlePasswordLogin = async () => {
    if (!admissionId.trim()) {
      Alert.alert("Required", "Please enter your Admission ID.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Required", "Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      /*
       * We will connect the real Admission ID + Password
       * API here next.
       *
       * Example:
       *
       * const result = await authService.loginWithPassword({
       *   admissionId,
       *   password,
       * });
       *
       * await login(result);
       */

      Alert.alert(
        "Login API",
        "Admission ID + Password API will be connected next."
      );
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error?.message || "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // SEND OTP
  // --------------------------------------------------

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      Alert.alert(
        "Required",
        "Please enter your email or mobile number."
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Keep your existing OTP API call here.
       *
       * Example:
       *
       * await authService.sendOtp(identifier);
       */

      Alert.alert("OTP", "Your existing OTP API will be called here.");

      setOtpSent(true);
    } catch (error) {
      Alert.alert(
        "OTP Failed",
        error?.message || "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // VERIFY OTP
  // --------------------------------------------------

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert("Required", "Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Keep your existing OTP verification API here.
       *
       * Example:
       *
       * const result = await authService.verifyOtp({
       *   identifier,
       *   otp,
       * });
       *
       * await login(result);
       */

      Alert.alert("OTP", "Your existing OTP verification will be used here.");
    } catch (error) {
      Alert.alert(
        "Verification Failed",
        error?.message || "Invalid OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons
              name="school"
              size={32}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.title}>Welcome Back</Text>

          <Text style={styles.subtitle}>
            Sign in to your school account
          </Text>
        </View>

        {/* LOGIN MODE TOGGLER */}

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              loginMode === "password" && styles.toggleButtonActive,
            ]}
            onPress={() => setLoginMode("password")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={
                loginMode === "password" ? "#FFFFFF" : "#6B7280"
              }
            />

            <Text
              style={[
                styles.toggleText,
                loginMode === "password" && styles.toggleTextActive,
              ]}
            >
              ID & Password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              loginMode === "otp" && styles.toggleButtonActive,
            ]}
            onPress={() => setLoginMode("otp")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color={
                loginMode === "otp" ? "#FFFFFF" : "#6B7280"
              }
            />

            <Text
              style={[
                styles.toggleText,
                loginMode === "otp" && styles.toggleTextActive,
              ]}
            >
              OTP
            </Text>
          </TouchableOpacity>
        </View>

        {/* ------------------------------------------------ */}
        {/* ID + PASSWORD LOGIN */}
        {/* ------------------------------------------------ */}

        {loginMode === "password" && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Login with Admission ID</Text>

            <Text style={styles.formSubtitle}>
              Enter your admission ID and password
            </Text>

            {/* Admission ID */}

            <Text style={styles.label}>Admission ID</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#6B7280"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter Admission ID"
                placeholderTextColor="#9CA3AF"
                value={admissionId}
                onChangeText={setAdmissionId}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}

            <Text style={styles.label}>Password</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#6B7280"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={21}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* Login button */}

            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handlePasswordLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() =>
                Alert.alert(
                  "Forgot Password",
                  "Password reset will be added next."
                )
              }
            >
              <Text style={styles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ------------------------------------------------ */}
        {/* OTP LOGIN */}
        {/* ------------------------------------------------ */}

        {loginMode === "otp" && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Login with OTP</Text>

            <Text style={styles.formSubtitle}>
              Use your registered email or mobile number
            </Text>

            {/* Identifier */}

            <Text style={styles.label}>
              Email or Mobile Number
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#6B7280"
              />

              <TextInput
                style={styles.input}
                placeholder="Email or mobile number"
                placeholderTextColor="#9CA3AF"
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Send OTP */}

            {!otpSent && (
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  loading && styles.loginButtonDisabled,
                ]}
                onPress={handleSendOtp}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? "Sending..." : "Send OTP"}
                </Text>
              </TouchableOpacity>
            )}

            {/* OTP */}

            {otpSent && (
              <>
                <Text style={styles.label}>OTP</Text>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="keypad-outline"
                    size={20}
                    color="#6B7280"
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Enter 6-digit OTP"
                    placeholderTextColor="#9CA3AF"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    loading && styles.loginButtonDisabled,
                  ]}
                  onPress={handleVerifyOtp}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.changeIdentifier}
                  onPress={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                >
                  <Text style={styles.changeIdentifierText}>
                    Change Email / Mobile
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        <Text style={styles.footerText}>
          School Management System
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#4361EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },

  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 14,
    padding: 4,
    marginBottom: 22,
  },

  toggleButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  toggleButtonActive: {
    backgroundColor: "#4361EE",
  },

  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },

  toggleTextActive: {
    color: "#FFFFFF",
  },

  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
  },

  formSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 22,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 7,
    marginTop: 10,
  },

  inputContainer: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    marginLeft: 10,
    paddingVertical: 12,
  },

  loginButton: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: "#4361EE",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  loginButtonDisabled: {
    opacity: 0.6,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  forgotPassword: {
    alignItems: "center",
    marginTop: 18,
  },

  forgotPasswordText: {
    color: "#4361EE",
    fontSize: 14,
    fontWeight: "600",
  },

  changeIdentifier: {
    alignItems: "center",
    marginTop: 18,
  },

  changeIdentifierText: {
    color: "#4361EE",
    fontSize: 14,
    fontWeight: "600",
  },

  footerText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 28,
  },
});

