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

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password) {
      return Alert.alert("Missing Details", "Please enter your email and password.");
    }
    router.navigate("/pages/home");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-900"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />

      {/* decorative circles */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: -80, right: -60, width: 240, height: 240, borderRadius: 120, backgroundColor: "#1E293B" }}
      />
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 120, left: -40, width: 90, height: 90, borderRadius: 45, backgroundColor: "#FACC15", opacity: 0.12 }}
      />

      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Branding */}
        <View className="items-center mb-8">
          <View
            className="w-20 h-20 bg-yellow-400 rounded-[28px] justify-center items-center mb-4"
            style={{ shadowColor: "#FACC15", shadowOpacity: 0.45, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 10 }}
          >
            <Ionicons name="checkmark-done" size={40} color="#0F172A" />
          </View>
          <Text className="text-3xl font-extrabold text-white">To-Do List</Text>
          <Text className="text-slate-400 text-base mt-2 text-center">
            Organize your day, achieve your goals.
          </Text>
        </View>

        {/* Card */}
        <View
          className="bg-white rounded-[32px] p-6 py-10"
          style={{ shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12 }}
        >
          <Text className="text-2xl font-extrabold text-slate-900">Welcome Back!</Text>
          <Text className="text-slate-500 mt-1 mb-6">Login to continue managing your tasks.</Text>

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
            placeholder="Enter your password"
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

          <TouchableOpacity
            className="self-end mt-3 mb-6"
            onPress={() => Alert.alert("Forgot password", "Password reset is not available yet.")}
          >
            <Text className="text-slate-500 text-sm font-semibold">Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-slate-900 rounded-2xl py-4 items-center flex-row justify-center"
            activeOpacity={0.85}
            onPress={handleLogin}
          >
            <Text className="text-yellow-400 text-lg font-bold mr-2">Login</Text>
            <Ionicons name="arrow-forward" size={20} color="#FACC15" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-slate-400 text-sm">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text className="text-yellow-400 text-sm font-bold">Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}