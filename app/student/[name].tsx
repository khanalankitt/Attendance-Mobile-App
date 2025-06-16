import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../utils/supabase";

export default function DynamicStudent() {
  const { name, subjects, student_id } = useLocalSearchParams();
  const subjectList = React.useMemo(() => {
    try {
      return subjects ? JSON.parse(subjects as string) : [];
    } catch {
      return [];
    }
  }, [subjects]);
  const [attendanceData, setAttendanceData] = useState<
    { subject: string; total_present: number; total_classes: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!name || subjectList.length === 0 || !student_id) return;

    const fetchAttendance = async () => {
      setLoading(true);

      const subjectsNames = subjectList.map((sub: any) => sub.name);
      const { data, error } = await supabase
        .from("attendance_summary")
        .select("subject, total_present, total_classes")
        .eq("student_id", student_id)
        .in("subject", subjectsNames);

      if (error) {
        console.error("Failed to fetch attendance summary:", error);
        setLoading(false);
        return;
      }

      setAttendanceData(data || []);
      setLoading(false);
    };

    fetchAttendance();
  }, [name, subjectList, student_id]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>{"←"}</Text>
        </Pressable>
        <View style={styles.navbarHeader}>
          <Text numberOfLines={1}
            ellipsizeMode="middle"
            style={styles.navbarTitle}>{name}</Text>
        </View>
      </View>

      {/* Subject List */}
      <FlatList
        style={{ marginTop: 20 }}
        data={subjectList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const attendance = attendanceData.find(a => a.subject === item.name) || {
            total_present: 0,
            total_classes: 0,
          };

          return (
            <Link
              href={{
                pathname: "/report/[name]",
                params: { name: name.toString(), subject: item.name, present: attendance.total_present, total: attendance.total_classes, student_id: student_id },
              }}
              asChild
            >
              <Pressable style={styles.subjectCard}>
                <View style={styles.subjectContent}>
                  <Text style={styles.subjectText}>{item.name}</Text>
                  <Text style={styles.subjectText}>
                    {
                      loading && <ActivityIndicator size="small" color="black" />
                    }
                    {!loading && attendance.total_present}
                  </Text>
                </View>
              </Pressable>
            </Link>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1eee9",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  navbar: {
    height: 80,
    marginTop: -5,
    backgroundColor: "#1f2937",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  navbarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 25,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 40,
  },
  navbarTitle: {
    textAlign: "center",
    color: "white",
    fontSize: 23,
    fontWeight: "bold",
    maxWidth: 250, // adjust as needed

  },
  subjectCard: {
    height: 70,
    width: "100%",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#9ca3af", // border-gray-400
    justifyContent: "center",
    alignItems: "center",
  },
  subjectContent: {
    height: "100%",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  subjectText: {
    fontSize: 18,
  },
});
