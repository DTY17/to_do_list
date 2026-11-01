import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

type Task = { id: string; title: string; date: string; time: string; done: boolean };

// ---------- helpers ----------
const formatDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const formatTime = (d: Date) =>
  d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

const parseDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const getDisplayDate = (s: string) =>
  parseDate(s).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// "09:30 PM" -> minutes, used to sort tasks within a day
const toMinutes = (t: string) => {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return h * 60 + Number(m[2]);
};

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

const shadow = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export default function HomeScreen() {
  const today = formatDate(new Date());

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarMonth, setCalendarMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState(today);
  const [taskTime, setTaskTime] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  const [timePickerValue, setTimePickerValue] = useState(new Date());

  // ---------- calendar ----------
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const startingDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [
    ...Array(startingDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthName = calendarMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const changeMonth = (dir: number) => setCalendarMonth(new Date(year, month + dir, 1));

  const goToday = () => {
    setSelectedDate(today);
    setCalendarMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  };

  // ---------- modal helpers ----------
  const closeModal = () => {
    setModalVisible(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const openAddTaskModal = () => {
    setTaskName("");
    setTaskDate(selectedDate);
    setTaskTime("");
    setShowDatePicker(false);
    setShowTimePicker(false);
    setDatePickerValue(new Date(`${selectedDate}T12:00:00`));
    setTimePickerValue(new Date());
    setModalVisible(true);
  };

  const openDatePicker = () => {
    setDatePickerValue(parseDate(taskDate));
    setShowTimePicker(false);
    setShowDatePicker(true);
  };

  const openTimePicker = () => {
    setTimePickerValue(new Date());
    setShowDatePicker(false);
    setShowTimePicker(true);
  };

  const handleDateChange = (event: any, picked?: Date) => {
    if (event.type === "dismissed") return setShowDatePicker(false);
    if (picked) {
      setDatePickerValue(picked);
      setTaskDate(formatDate(picked));
      if (Platform.OS === "android") setShowDatePicker(false);
    }
  };

  const handleTimeChange = (event: any, picked?: Date) => {
    if (event.type === "dismissed") return setShowTimePicker(false);
    if (picked) {
      setTimePickerValue(picked);
      setTaskTime(formatTime(picked));
      if (Platform.OS === "android") setShowTimePicker(false);
    }
  };

  // ---------- tasks ----------
  const addTask = () => {
    if (!taskName.trim()) return Alert.alert("Missing Task", "Please enter a task name.");
    if (!taskDate) return Alert.alert("Missing Date", "Please select a date.");
    if (!taskTime) return Alert.alert("Missing Time", "Please select a time.");

    const parsed = parseDate(taskDate);

    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: taskName.trim(), date: taskDate, time: taskTime, done: false },
    ]);
    setSelectedDate(taskDate);
    setCalendarMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
    closeModal();
  };

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTask = (id: string) =>
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setTasks((prev) => prev.filter((t) => t.id !== id)),
      },
    ]);

  const filteredTasks = tasks
    .filter((t) => t.date === selectedDate)
    .sort((a, b) => toMinutes(a.time) - toMinutes(b.time));

  const completedTasks = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  const pendingToday = tasks.filter((t) => t.date === today && !t.done).length;

  // ---------- picker shared UI ----------
  const FieldButton = ({
    label,
    value,
    icon,
    onPress,
    placeholder,
  }: {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    placeholder?: boolean;
  }) => (
    <>
      <Text className="text-slate-700 text-sm font-semibold mb-2">{label}</Text>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="bg-slate-100 rounded-2xl px-4 py-4 mb-4 flex-row justify-between items-center"
      >
        <Text className={placeholder ? "text-slate-400 font-medium" : "text-slate-800 font-medium"}>
          {value}
        </Text>
        <View className="w-8 h-8 rounded-full bg-yellow-100 items-center justify-center">
          <Ionicons name={icon} size={16} color="#A16207" />
        </View>
      </TouchableOpacity>
    </>
  );

  return (
    <View className="flex-1 bg-slate-100">
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ================= HEADER ================= */}
        <View className="bg-slate-900 px-5 pt-14 pb-7 rounded-b-[36px] overflow-hidden">
          {/* decorative circles */}
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
          <View
            style={{
              position: "absolute",
              top: 60,
              right: 50,
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "#FACC15",
              opacity: 0.12,
            }}
          />

          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-slate-400 text-sm font-medium">{greeting()} 👋</Text>
              <Text className="text-white text-3xl font-extrabold mt-1">Let's get it done</Text>
              <Text className="text-slate-400 text-sm mt-1">
                {pendingToday === 0
                  ? "Nothing pending for today."
                  : `${pendingToday} task${pendingToday > 1 ? "s" : ""} waiting for you today.`}
              </Text>
            </View>

            <View className="w-12 h-12 rounded-2xl bg-yellow-400 items-center justify-center">
              <Text className="text-slate-900 text-xl font-extrabold">T</Text>
            </View>
          </View>

          {/* progress card */}
          <View className="bg-slate-800 rounded-3xl p-4 border border-slate-700">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className="w-11 h-11 rounded-2xl bg-slate-700 items-center justify-center mr-3">
                  <Ionicons name="trending-up" size={22} color="#FACC15" />
                </View>
                <View>
                  <Text className="text-slate-400 text-xs">Overall progress</Text>
                  <Text className="text-white text-2xl font-extrabold">{Math.round(progress)}%</Text>
                </View>
              </View>

              <View className="bg-slate-700 px-3 py-2 rounded-full">
                <Text className="text-yellow-400 text-xs font-bold">
                  {completedTasks}/{totalTasks} done
                </Text>
              </View>
            </View>

            <View className="h-2.5 bg-slate-700 rounded-full mt-4 overflow-hidden">
              <View
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>
        </View>

        {/* ================= CALENDAR ================= */}
        <View className="px-5 mt-6">
          <View className="bg-white rounded-3xl p-4" style={shadow}>
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-2xl bg-slate-900 items-center justify-center mr-3">
                  <Ionicons name="calendar" size={18} color="#FACC15" />
                </View>
                <View>
                  <Text className="text-slate-400 text-xs font-semibold">Your schedule</Text>
                  <Text className="text-slate-900 text-lg font-bold">{monthName}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={goToday}
                  className="bg-yellow-100 px-3 h-9 rounded-full items-center justify-center mr-2"
                >
                  <Text className="text-yellow-700 text-xs font-bold">Today</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => changeMonth(-1)}
                  className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
                >
                  <Ionicons name="chevron-back" size={18} color="#334155" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => changeMonth(1)}
                  className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center ml-2"
                >
                  <Ionicons name="chevron-forward" size={18} color="#334155" />
                </TouchableOpacity>
              </View>
            </View>

            {/* week days */}
            <View className="flex-row mb-2 bg-slate-50 rounded-xl py-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <View key={d} className="items-center" style={{ width: "14.2857%" }}>
                  <Text className="text-slate-400 text-xs font-semibold">{d}</Text>
                </View>
              ))}
            </View>

            {/* days */}
            <View className="flex-row flex-wrap">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <View key={`empty-${index}`} style={{ width: "14.2857%", height: 48 }} />;
                }

                const dateString = formatDate(new Date(year, month, day));
                const isSelected = selectedDate === dateString;
                const isToday = today === dateString;
                const hasTasks = tasks.some((t) => t.date === dateString);

                return (
                  <TouchableOpacity
                    key={dateString}
                    activeOpacity={0.7}
                    onPress={() => setSelectedDate(dateString)}
                    style={{
                      width: "14.2857%",
                      height: 48,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 14,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isSelected ? "#0F172A" : isToday ? "#FEF3C7" : "transparent",
                        borderWidth: isToday && !isSelected ? 1 : 0,
                        borderColor: "#FACC15",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: isSelected || isToday ? "700" : "500",
                          color: isSelected ? "#FACC15" : "#334155",
                        }}
                      >
                        {day}
                      </Text>
                    </View>

                    {hasTasks && (
                      <View
                        style={{
                          position: "absolute",
                          bottom: 1,
                          width: 5,
                          height: 5,
                          borderRadius: 3,
                          backgroundColor: isSelected ? "#0F172A" : "#FACC15",
                        }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* legend */}
            <View className="flex-row items-center mt-3 pt-3 border-t border-slate-100">
              <View className="flex-row items-center mr-5">
                <View className="w-3 h-3 rounded bg-slate-900 mr-2" />
                <Text className="text-slate-400 text-xs">Selected</Text>
              </View>
              <View className="flex-row items-center mr-5">
                <View className="w-3 h-3 rounded bg-yellow-100 border border-yellow-400 mr-2" />
                <Text className="text-slate-400 text-xs">Today</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-yellow-400 mr-2" />
                <Text className="text-slate-400 text-xs">Has tasks</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ================= TASKS ================= */}
        <View className="px-5 mt-7">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-slate-900 text-xl font-extrabold">My Tasks</Text>
              <Text className="text-slate-400 text-xs mt-1">{getDisplayDate(selectedDate)}</Text>
            </View>

            <View className="bg-slate-900 px-4 py-2 rounded-full">
              <Text className="text-yellow-400 text-xs font-bold">
                {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
              </Text>
            </View>
          </View>

          {filteredTasks.length === 0 && (
            <View
              className="bg-white rounded-3xl p-8 items-center border border-dashed border-slate-300"
            >
              <View className="w-20 h-20 rounded-full bg-yellow-100 items-center justify-center mb-4">
                <Ionicons name="clipboard-outline" size={36} color="#A16207" />
              </View>
              <Text className="text-slate-800 text-base font-bold">No tasks for this day</Text>
              <Text className="text-slate-400 text-xs mt-2 text-center">
                Your schedule is clear. Tap + to add a task.
              </Text>
            </View>
          )}

          {filteredTasks.map((task) => (
            <View
              key={task.id}
              className="bg-white rounded-2xl mb-3 flex-row items-center overflow-hidden"
              style={shadow}
            >
              {/* accent bar */}
              <View
                style={{
                  width: 5,
                  alignSelf: "stretch",
                  backgroundColor: task.done ? "#CBD5E1" : "#FACC15",
                }}
              />

              <TouchableOpacity
                onPress={() => toggleTask(task.id)}
                activeOpacity={0.7}
                className="mx-3"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: task.done ? "#FACC15" : "#CBD5E1",
                  backgroundColor: task.done ? "#FACC15" : "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {task.done && <Ionicons name="checkmark" size={16} color="#0F172A" />}
              </TouchableOpacity>

              <View className="flex-1 py-4">
                <Text
                  className={`text-base font-semibold ${
                    task.done ? "text-slate-400 line-through" : "text-slate-800"
                  }`}
                >
                  {task.title}
                </Text>

                <View className="flex-row items-center mt-2">
                  <View className="flex-row items-center bg-slate-100 px-2.5 py-1 rounded-full">
                    <Ionicons name="time-outline" size={12} color="#64748B" />
                    <Text className="text-slate-500 text-xs font-medium ml-1">{task.time}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => deleteTask(task.id)}
                className="w-9 h-9 rounded-full bg-red-50 items-center justify-center mx-3"
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ================= FAB ================= */}
      <TouchableOpacity
        onPress={openAddTaskModal}
        activeOpacity={0.85}
        style={{
          position: "absolute",
          right: 22,
          bottom: 25,
          width: 60,
          height: 60,
          borderRadius: 22,
          backgroundColor: "#FACC15",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#FACC15",
          shadowOpacity: 0.5,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={32} color="#0F172A" />
      </TouchableOpacity>

      {/* ================= ADD TASK MODAL ================= */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center bg-black/60 px-5"
        >
          <Pressable className="absolute inset-0" onPress={closeModal} />

          <View className="bg-white rounded-[28px] p-5">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <View className="w-11 h-11 rounded-2xl bg-slate-900 items-center justify-center mr-3">
                  <Ionicons name="create-outline" size={20} color="#FACC15" />
                </View>
                <View>
                  <Text className="text-slate-900 text-xl font-extrabold">Add New Task</Text>
                  <Text className="text-slate-400 text-xs mt-0.5">Plan your next activity.</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={closeModal}
                className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#475569" />
              </TouchableOpacity>
            </View>

            <Text className="text-slate-700 text-sm font-semibold mb-2">Task Name</Text>
            <View className="bg-slate-100 rounded-2xl px-4 mb-4 flex-row items-center">
              <Ionicons name="pencil-outline" size={18} color="#94A3B8" />
              <TextInput
                value={taskName}
                onChangeText={setTaskName}
                placeholder="Enter your task name"
                placeholderTextColor="#94A3B8"
                className="flex-1 py-4 ml-3 text-slate-800"
              />
            </View>

            <FieldButton
              label="Select Date"
              value={getDisplayDate(taskDate)}
              icon="calendar-outline"
              onPress={openDatePicker}
            />

            {showDatePicker && (
              <View className="bg-slate-50 rounded-2xl p-2 mb-4">
                <DateTimePicker
                  value={datePickerValue}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  themeVariant="light"
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    className="bg-slate-900 rounded-xl py-3 items-center mt-2"
                  >
                    <Text className="text-yellow-400 font-bold">Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <FieldButton
              label="Select Time"
              value={taskTime || "Choose a time"}
              icon="time-outline"
              onPress={openTimePicker}
              placeholder={!taskTime}
            />

            {showTimePicker && (
              <View className="bg-slate-50 rounded-2xl p-2 mb-4">
                <DateTimePicker
                  value={timePickerValue}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleTimeChange}
                  themeVariant="light"
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(false)}
                    className="bg-slate-900 rounded-xl py-3 items-center mt-2"
                  >
                    <Text className="text-yellow-400 font-bold">Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <TouchableOpacity
              onPress={addTask}
              activeOpacity={0.85}
              className="bg-yellow-400 rounded-2xl py-4 items-center mt-2 flex-row justify-center"
            >
              <Ionicons name="checkmark-circle" size={20} color="#0F172A" />
              <Text className="text-slate-900 font-extrabold text-base ml-2">Add Task</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeModal} className="py-3 items-center mt-1">
              <Text className="text-slate-500 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}