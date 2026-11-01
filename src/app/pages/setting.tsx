import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const shadow = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export default function Setting() {
  const router = useRouter();
  const [username, setUsername] = useState("Dinan");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    if (!username.trim()) return Alert.alert("Error", "Username cannot be empty.");
    if (password.length < 8)
      return Alert.alert("Error", "Password must contain at least 8 characters.");
    if (password !== confirmPassword) return Alert.alert("Error", "Passwords do not match.");

    Alert.alert("Success", "Settings updated successfully!");
    setPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () =>
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => router.replace("/login") },
    ]);

  const Field = ({
    label,
    icon,
    ...props
  }: { label: string; icon: keyof typeof Ionicons.glyphMap } & React.ComponentProps<typeof TextInput>) => (
    <>
      <Text className="text-slate-700 font-semibold mb-2">{label}</Text>
      <View className="bg-slate-100 rounded-2xl px-4 mb-5 flex-row items-center">
        <Ionicons name={icon} size={20} color="#94A3B8" />
        <TextInput
          className="flex-1 py-4 ml-3 text-slate-900"
          placeholderTextColor="#94A3B8"
          {...props}
        />
      </View>
    </>
  );

  return (
    <View className="flex-1 bg-slate-100">
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header with profile */}
        <View className="bg-slate-900 px-6 pt-14 pb-16 rounded-b-[36px] overflow-hidden">
          <View
            style={{
              position: "absolute",
              top: -50,
              right: -40,
              width: 170,
              height: 170,
              borderRadius: 85,
              backgroundColor: "#1E293B",
            }}
          />
          <Text className="text-3xl font-extrabold text-white">Settings</Text>
          <Text className="text-slate-400 mt-1">Manage your account information.</Text>
        </View>

        {/* Profile card overlapping header */}
        <View className="px-6" style={{ marginTop: -40 }}>
          <View className="bg-white rounded-3xl p-5 flex-row items-center" style={shadow}>
            <View className="w-16 h-16 rounded-2xl bg-yellow-400 items-center justify-center">
              <Text className="text-slate-900 text-3xl font-extrabold">
                {username.charAt(0).toUpperCase() || "?"}
              </Text>
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-xl font-extrabold text-slate-900">{username || "Your name"}</Text>
              <View className="flex-row items-center mt-1">
                <View className="w-2 h-2 rounded-full bg-yellow-400 mr-2" />
                <Text className="text-slate-400 text-sm">Account profile</Text>
              </View>
            </View>
          </View>

          {/* Account details */}
          <View className="bg-white rounded-3xl p-5 mt-5" style={shadow}>
            <View className="flex-row items-center mb-6">
              <View className="w-10 h-10 rounded-2xl bg-slate-900 items-center justify-center mr-3">
                <Ionicons name="person" size={18} color="#FACC15" />
              </View>
              <Text className="text-xl font-extrabold text-slate-900">Account Details</Text>
            </View>

            <Field
              label="Username"
              icon="person-outline"
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              autoCapitalize="none"
            />

            <Field
              label="New Password"
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              secureTextEntry={!showPassword}
            />

            <Field
              label="Confirm Password"
              icon="shield-checkmark-outline"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              className="flex-row items-center mb-2"
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#64748B"
              />
              <Text className="text-slate-500 text-sm font-medium ml-2">
                {showPassword ? "Hide passwords" : "Show passwords"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-slate-900 rounded-2xl py-4 items-center mt-5 flex-row justify-center"
              activeOpacity={0.85}
              onPress={handleSave}
            >
              <Ionicons name="save-outline" size={20} color="#FACC15" />
              <Text className="text-yellow-400 font-bold text-lg ml-2">Save Changes</Text>
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.85}
            className="bg-white rounded-2xl py-4 mt-5 flex-row items-center justify-center"
            style={shadow}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-red-500 font-bold text-base ml-2">Log out</Text>
          </TouchableOpacity>

          <Text className="text-center text-slate-400 mt-8">To-Do List App</Text>
        </View>
      </ScrollView>
    </View>
  );
}