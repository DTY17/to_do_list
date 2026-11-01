import { useState, ReactNode } from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = TextInputProps & {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  right?: ReactNode;
  borderColor?: string; // optional override (e.g. error / success)
  last?: boolean;
};

export default function AuthInput({ label, icon, right, borderColor, last, ...props }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: last ? 0 : 16 }}>
      <Text className="text-slate-700 font-semibold mb-2 text-sm">{label}</Text>

      <View
        className="rounded-2xl px-4 flex-row items-center"
        style={{
          backgroundColor: focused ? "#FFFFFF" : "#F1F5F9",
          borderWidth: 1.5,
          borderColor: borderColor ?? (focused ? "#FACC15" : "#F1F5F9"),
        }}
      >
        <Ionicons name={icon} size={20} color={focused ? "#0F172A" : "#94A3B8"} />

        <TextInput
          className="flex-1 ml-3 text-slate-900"
          style={{ paddingVertical: 14 }}
          placeholderTextColor="#94A3B8"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />

        {right}
      </View>
    </View>
  );
}