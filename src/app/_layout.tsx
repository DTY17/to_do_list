import { Stack } from "expo-router";
import { View } from "react-native";
import "../global.css";

export default function MainLayout() {
  return (
    <View className="w-full h-full">
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="pages" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}