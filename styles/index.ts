import { StatusBar, StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const calendarStyles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    paddingHorizontal: 12,
    paddingVertical: 16,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nav: { fontSize: 24 },
  title: { fontSize: 18, fontWeight: "bold" },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  weekText: {
    width: "14.285%",
    textAlign: "center",
  },
  dayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 8,
  },
  selectedDayBox: {
    borderRadius: 999,
    borderColor: "#04B6D9",
  },
  dayBox: {
    width: "14.285%",
    height: 0,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
    display: "flex",
  },
  dayText: {
    fontSize: 16,
    textAlign: "center",
  },
});
