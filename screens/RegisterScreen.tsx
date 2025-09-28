import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/registerStyles";
import API_BASE from "../config/api";
import { RootStackParamList } from "../navigation/AppNavigator";
import * as Keychain from "react-native-keychain";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; otp?: string }>({});
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    const newErrors: typeof errors = {};
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
      valid = false;
    }
    if (otpSent && !otp.trim()) {
      newErrors.otp = "OTP is required";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_no: phone }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
      } else {
        Alert.alert("Error", data.message || "Failed to request OTP");
      }
    } catch (err: any) {
      Alert.alert("Network Error", err.message || "Check your connection");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_no: phone.trim(),
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        Alert.alert("Error", data.message || "Invalid OTP");
        return;
      }

      await Keychain.setGenericPassword("auth", data.token, {
        service: "sanctum",
      });

      Alert.alert("Success", "OTP verified successfully!");

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (err) {
      console.error("Network error (verify):", err);
      Alert.alert("Network Error", "Please check your connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Section: Logo */}
      <View style={styles.topSection}>
        <Image
          source={require("../assets/frutify-app-logo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Section: Input + Actions */}
      <View style={styles.bottomSection}>
        {loading && <ActivityIndicator size="large" color="#000" />}

        {!otpSent ? (
          <>
            <View style={styles.inputContainerRow}>
              <Text style={styles.prefix}>+91</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.inputPhone,
                    errors.phone ? styles.inputError : null,
                  ]}
                  placeholder="Enter Phone Number"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text.replace(/[^0-9]/g, ""));
                    setErrors({ ...errors, phone: undefined });
                  }}
                />
              </View>
            </View>
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.otp ? styles.inputError : null]}
                placeholder="Enter OTP"
                keyboardType="number-pad"
                value={otp}
                onChangeText={(text) => {
                  setOtp(text);
                  setErrors({ ...errors, otp: undefined });
                }}
              />
              {errors.otp && (
                <Text style={styles.errorText}>{errors.otp}</Text>
              )}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleVerify}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#6c757d", marginTop: 10 },
              ]}
              onPress={() => {
                setOtpSent(false);
                setOtp("");
              }}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default RegisterScreen;
