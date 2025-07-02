import { IconSymbol } from "@/components/ui/IconSymbol";
import { calendarStyles } from "@/styles";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// 캘린더 헤더에 보여질 요일 데이터
const DAYS = [
  { label: "Sun", color: "#CA1B1B" },
  { label: "Mon", color: "#ABABAB" },
  { label: "Tue", color: "#ABABAB" },
  { label: "Wed", color: "#ABABAB" },
  { label: "Thu", color: "#ABABAB" },
  { label: "Fri", color: "#ABABAB" },
  { label: "Sat", color: "#04B6D9" },
];

// 년도와 달을 파라미터로 받아 해당 달에 존재하는 날짜 데이터를 반환하는 함수
const getDaysInMonth = (year: number, month: number) => {
  const startDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  return Array(startDay)
    .fill(null)
    .concat(Array.from({ length: lastDate }, (_, i) => i + 1));
};

// 날짜를 파라미터로 받아 해당 날짜가 속한 주의 데이터를 반환하는 함수
const getWeekForDate = (date: Date) => {
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - sunday.getDay());

  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
};

export default function CalendarWithGesture() {
  const [calendarMode, setCalendarMode] = useState<"month" | "week">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>();

  const calendarHeight = useSharedValue(330);
  const calendarOpacity = useSharedValue(1);
  const calendarScale = useSharedValue(1);

  useEffect(() => {
    const isMonth = calendarMode === "month";

    calendarHeight.value = withTiming(isMonth ? 330 : 55, {
      duration: 400,
      easing: Easing.inOut(Easing.ease),
    });

    calendarOpacity.value = withTiming(isMonth ? 1 : 0.8, {
      duration: 400,
      easing: Easing.inOut(Easing.ease),
    });

    calendarScale.value = withTiming(isMonth ? 1 : 0.95, {
      duration: 400,
      easing: Easing.inOut(Easing.ease),
    });
  }, [calendarHeight, calendarMode, calendarOpacity, calendarScale]);

  const goToPrev = () => {
    // 현재 보기 모드가 달이라면 이전 달로 변경
    if (calendarMode === "month") {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      // 현재 보기 모드가 주라면 이전 주로 변경
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const goToNext = () => {
    // 현재 보기 모드가 달이라면 다음 달로 변경
    if (calendarMode === "month") {
      setCurrentDate(new Date(year, month + 1, 1));
    } else {
      // 현재 보기 모드가 주라면 다음 주로 변경
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const gesture = Gesture.Pan().onEnd((e) => {
    // 위로 스와이프 하면 보기 모드를 주로 변경
    if (e.translationY < -50) {
      runOnJS(setCalendarMode)("week");
    }
    // 아래로 스와이프 하면 보기 모드를 달로 변경
    else if (e.translationY > 50) {
      runOnJS(setCalendarMode)("month");
    }
    // 왼쪽으로 스와이프 하면 다음 달/주로 변경
    else if (e.translationX < -50) {
      runOnJS(goToNext)();
    }
    // 오른쪽으로 스와이프 하면 이전 달/주로 변경
    else if (e.translationX > 50) {
      runOnJS(goToPrev)();
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    height: calendarHeight.value,
    opacity: calendarOpacity.value,
    transform: [{ scaleY: calendarScale.value }],
    overflow: "hidden",
  }));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const currentWeek = getWeekForDate(currentDate);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <View style={calendarStyles.container}>
          {/* Header */}
          <View style={calendarStyles.header}>
            <TouchableOpacity onPress={goToPrev}>
              <IconSymbol name="chevron.left" color="#04B6D9" />
            </TouchableOpacity>
            <Text style={calendarStyles.title}>
              {year}년 {month + 1}월
            </Text>
            <TouchableOpacity onPress={goToNext}>
              <IconSymbol name="chevron.right" color="#04B6D9" />
            </TouchableOpacity>
          </View>

          {/* 요일 */}
          <View style={calendarStyles.weekRow}>
            {DAYS.map((day) => (
              <Text
                key={day.label}
                style={{ ...calendarStyles.weekText, color: day.color }}
              >
                {day.label}
              </Text>
            ))}
          </View>

          {/* 캘린더 */}
          <Animated.View style={[animatedStyle]}>
            <View style={calendarStyles.dayGrid}>
              {(calendarMode === "month" ? daysInMonth : currentWeek).map(
                (day, idx) => {
                  const isSelected =
                    `${currentDate.getMonth()}-${day}` === selectedDate;

                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() =>
                        setSelectedDate(`${currentDate.getMonth()}-${day}`)
                      }
                      style={[
                        calendarStyles.dayBox,
                        isSelected && calendarStyles.selectedDayBox,
                      ]}
                    >
                      <Text style={calendarStyles.dayText}>
                        {typeof day === "number" ? day : day?.getDate?.() ?? ""}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
