import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AuthInput from "../components/authinput";
import "../global.css";

const strengthLabels = ["Too short", "Weak", "Okay", "Good", "Strong"];

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const strength =
    password.length === 0
      ? 0
      : (password.length >= 8 ? 1 : 0) +
        (/[A-Z]/.test(password) ? 1 : 0) +
        (/\d/.test(password) ? 1 : 0) +
        (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsDiffer = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSignup = () => {
    if (!name.trim()) return Alert.alert("Missing Name", "Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      return Alert.alert("Invalid Email", "Please enter a valid email address.");
    if (password.length < 8)
      return Alert.alert("Weak Password", "Password must contain at least 8 characters.");
    if (password !== confirmPassword)
      return Alert.alert("Passwords Don't Match", "Please re-enter the same password.");

    Alert.alert("Account Created", "Welcome aboard!", [
      { text: "Continue", onPress: () => router.replace("/pages/home") },
    ]);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-900"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />

      <View
        pointerEvents="none"
        style={{ position: "absolute", top: -80, right: -60, width: 240, height: 240, borderRadius: 120, backgroundColor: "#1E293B" }}
      />
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 120, left: -40, width: 90, height: 90, borderRadius: 45, backgroundColor: "#FACC15", opacity: 0.12 }}
      />

      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 pb-10"
        contentContainerStyle={{ paddingTop: (StatusBar.currentHeight ?? 44) + 12 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center mb-5"
        >
          <Ionicons name="chevron-back" size={20} color="#FACC15" />
        </TouchableOpacity>

        {/* Branding */}
        <View className="items-center mb-7">
          <View
            className="w-20 h-20 bg-yellow-400 rounded-[28px] justify-center items-center mb-4"
            style={{ shadowColor: "#FACC15", shadowOpacity: 0.45, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 10 }}
          >
            <Ionicons name="person-add" size={34} color="#0F172A" />
          </View>
          <Text className="text-3xl font-extrabold text-white">Create Account</Text>
          <Text className="text-slate-400 text-base mt-2 text-center">
            Sign up to start planning your days.
          </Text>
        </View>

        {/* Card */}
        <View
          className="bg-white rounded-[32px] p-6 py-10"
          style={{ shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12 }}
        >
          <AuthInput
            label="Name"
            icon="person-outline"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />

          <AuthInput
            label="Email Address"
            icon="mail-outline"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <AuthInput
            label="Password"
            icon="lock-closed-outline"
            placeholder="At least 8 characters"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            last
            right={
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94A3B8" />
              </TouchableOpacity>
            }
          />

          {/* Strength meter (only once typing) */}
          {password.length > 0 && (
            <View className="flex-row items-center mt-2 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    marginRight: i < 4 ? 4 : 0,
                    backgroundColor: i <= strength ? "#FACC15" : "#E2E8F0",
                  }}
                />
              ))}
              <Text className="text-slate-500 text-xs font-medium ml-3" style={{ minWidth: 56 }}>
                {strengthLabels[strength]}
              </Text>
            </View>
          )}

          <View style={{ height: 16 }} />

          <AuthInput
            label="Re-enter Password"
            icon="shield-checkmark-outline"
            placeholder="Re-enter your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            last
            borderColor={passwordsDiffer ? "#EF4444" : passwordsMatch ? "#FACC15" : undefined}
            right={passwordsMatch ? <Ionicons name="checkmark-circle" size={20} color="#FACC15" /> : undefined}
          />

          {passwordsDiffer && (
            <Text className="text-red-500 text-xs mt-2">Passwords don't match yet.</Text>
          )}

          <TouchableOpacity
            className="bg-slate-900 rounded-2xl py-4 items-center flex-row justify-center mt-6"
            activeOpacity={0.85}
            onPress={handleSignup}
          >
            <Text className="text-yellow-400 text-lg font-bold mr-2">Sign Up</Text>
            <Ionicons name="arrow-forward" size={20} color="#FACC15" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-7">
          <Text className="text-slate-400 text-sm">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-yellow-400 text-sm font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}