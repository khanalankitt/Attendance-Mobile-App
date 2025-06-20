import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams, router } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import { Student } from "@/types/types";
import { supabase } from "@/utils/supabase";


const fetchStudentsAndSubjects = async (semester: string) => {
  try {
    if (!semester) {
      throw new Error("Semester is required");
    }

    // 1. Get students of the selected semester
    const { data: students, error: studentError } = await supabase
      .from("students")
      .select("*")
      .eq("semester", semester)
      .order("name", { ascending: true });

    if (studentError) {
      throw studentError;
    }

    // 2. Get the subjects of that semester
    const { data: semesterData, error: semesterError } = await supabase
      .from("semesters")
      .select("subjects")
      .eq("name", semester)
      .single();

    if (semesterError) {
      throw semesterError;
    }

    let subjects = [];
    if (semesterData?.subjects) {
      subjects = semesterData.subjects.split(",").map((sub: any) => {
        const trimmed = sub.trim();
        return { name: trimmed, value: trimmed };
      });
    }

    return {
      students,
      subjects,
    };
  } catch (error: any) {
    console.error("Error fetching from Supabase:", error.message);
    return { students: [], subjects: [] };
  }
};


export default function SemesterPage() {
  const { name, semester_id } = useLocalSearchParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [selectedRolls, setSelectedRolls] = useState<string[]>([]);

  const toggleSelection = (roll: string) => {
    setSelectedRolls((prevSelected) =>
      prevSelected.includes(roll)
        ? prevSelected.filter((r) => r !== roll)
        : [...prevSelected, roll]
    );
  };

  const handleSubmit = async () => {
    if (!subject) {
      alert("Please select a subject");
      return;
    }

    const attendanceDate = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

    try {
      setLoading(true);

      // 1. Insert attendance_dates for all students in the semester:
      //    Present students have present=true, absent false
      const attendanceRecords = students.map((student) => ({
        student_id: student.student_id,       // BIGINT
        semester_id: Number(semester_id),     // BIGINT
        subject,
        date: attendanceDate,
        present: selectedRolls.includes(student.roll || "") ? true : false,
      }));

      const { error: insertError } = await supabase
        .from("attendance_dates")
        .insert(attendanceRecords);

      if (insertError) {
        console.error("Insert attendance_dates error:", insertError);
        alert("Failed to save attendance");
        setLoading(false);
        return;
      }

      // 2. Update attendance_summary for each student
      for (const student of students) {
        const isPresent = selectedRolls.includes(student.roll || "");

        // Check if summary exists for student + subject
        const { data: summary, error: summaryError } = await supabase
          .from("attendance_summary")
          .select("*")
          .eq("student_id", student.student_id)
          .eq("subject", subject)
          .maybeSingle();

        if (summaryError) {
          console.error("Fetch summary error:", summaryError);
          continue;
        }

        if (summary) {
          // Update total_present and total_classes
          const { error: updateError } = await supabase
            .from("attendance_summary")
            .update({
              total_present: summary.total_present + (isPresent ? 1 : 0),
              total_classes: summary.total_classes + 1,
            })
            .eq("id", summary.id);

          if (updateError) {
            console.error("Update summary error:", updateError);
          }
        } else {
          // Insert new summary row
          const { error: insertSummaryError } = await supabase
            .from("attendance_summary")
            .insert({
              student_id: student.student_id,
              semester_id: Number(semester_id),
              subject,
              total_present: isPresent ? 1 : 0,
              total_classes: 1,
            });

          if (insertSummaryError) {
            console.error("Insert summary error:", insertSummaryError);
          }
        }
      }

      alert("Attendance saved successfully");
      setSelectedRolls([]);
      setSubject("");
    } catch (err) {
      console.error("handleSubmit error:", err);
      alert("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await fetchStudentsAndSubjects(name as string);
      setStudents(result.students);
      setSubjects(result.subjects);
      setLoading(false);
    };
    fetchData();
  }, [name]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="dark" />

        {/* navbar  */}
        <View style={styles.navbar}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.backButtonText}>{"←"}</Text>
          </Pressable>
          <View style={styles.navbarHeader}>
            <Text style={styles.navbarTitle}>{name} Semester</Text>
          </View>
        </View>
        <ActivityIndicator size="large" style={{ marginTop: 100 }} color="#1f2937" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="dark" />

      {/* navbar  */}
      <View style={styles.navbar}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.backButtonText}>{"←"}</Text>
        </Pressable>
        <View style={styles.navbarHeader}>
          <Text style={styles.navbarTitle}>{name} Semester</Text>
        </View>
      </View>
      <View style={styles.navbarActions}>
        <Dropdown
          style={styles.dropdown}
          data={subjects}
          onChange={(item) => setSubject(item.value)}
          placeholder="Select Subject"
          labelField="name"
          valueField="name"
          value={subject}
        />
        <Pressable style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      {/* student list  */}
      <View style={styles.studentListContainer}>
        <FlatList
          style={styles.studentList}
          contentContainerStyle={styles.studentListContent}
          scrollEnabled
          data={students}
          renderItem={({ item, index }) => (
            <StudentItem
              key={index}
              index={index}
              subjects={subjects}
              name={item.name || ""}
              roll={item.roll || ""}
              student_id={item.student_id || 0}
              isSelected={selectedRolls.includes(item.roll || "")}
              onPress={() => toggleSelection(item.roll || "")}
            />

          )}
        />
      </View>
    </SafeAreaView>
  );
}

export const StudentItem: React.FC<
  { index: number; student_id: number; subjects: any; name: string; roll: string; isSelected: boolean; onPress: () => void }
> = ({ index, student_id, subjects, name, roll, isSelected, onPress }) => (

  <Pressable
    onPress={onPress}
    style={[
      styles.studentItem,
      isSelected ? styles.studentItemSelected : styles.studentItemUnselected,
    ]}
  >
    <Link
      href={{
        pathname: "/student/[name]",
        params: { name: name ?? "", subjects: JSON.stringify(subjects ?? []), student_id: student_id },
      }}
    >
      <View style={styles.studentItemContent}>
        <Text style={{ fontSize: 18 }}>{index + 1}. </Text>
        <Text style={styles.studentItemText}>{` ${name}`}</Text>
      </View>
    </Link>
  </Pressable>
);

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
  },
  navbarActions: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  dropdown: {
    height: 45,
    width: 200,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
  },
  saveButton: {
    marginBottom: 20,
    height: 40,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
  },
  saveButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  studentListContainer: {
    flex: 1,
    width: "100%",
    margin: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  studentList: {
    height: "100%",
    width: "100%",
  },
  studentListContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  studentItem: {
    height: 56,
    width: 320,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 12,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  studentItemSelected: {
    backgroundColor: "#8fee93",
  },
  studentItemUnselected: {
    backgroundColor: "white",
  },
  studentItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  studentItemText: {
    fontSize: 18,
    textDecorationLine: "underline",
  },
});
