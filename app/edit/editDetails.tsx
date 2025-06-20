import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/utils/supabase";
export default function EditDetails() {
  const { name, subject, present, student_id } = useLocalSearchParams();
  const [editedValue, setEditedValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const handleEditSubmit = async () => {
    if (!editedValue) {
      alert("New Attendance cannot be empty");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("attendance_summary")
      .update({ total_present: Number(editedValue) })
      .eq("student_id", student_id)
      .eq("subject", subject);

    if (error) {
      console.error("Update error:", error);
      alert("Failed to update!");
    } else {
      alert("Attendance updated successfully");
      setEditedValue("");
      router.replace('/')
    }
    setLoading(false);
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>{"←"}</Text>
        </Pressable>
        <View style={styles.navbarHeader}>
          <Text numberOfLines={1}
            ellipsizeMode="middle" style={styles.navbarTitle}>
            {name}
          </Text>
        </View>
      </View>
      <Text style={styles.subjectTitle}>
        {subject}
      </Text>

      <View style={styles.mainContent}>
        <View style={styles.card}>
          <Text style={styles.label}>Present Attendance</Text>
          <TextInput
            style={styles.input}
            value={present.toString()}
            editable={false}
          />

          <Text style={styles.label}>New Attendance</Text>
          <TextInput
            keyboardType="numeric"
            value={editedValue}
            onChangeText={(text) => setEditedValue(text.toString())}
            placeholder="eg. 10"
            style={styles.editableInput}
          />
          <Pressable style={styles.saveButton} onPress={handleEditSubmit}>
            <Text style={styles.saveButtonText}>
              {
                loading && <ActivityIndicator size="small" color="white" />
              }
              {!loading && "Save"}
            </Text>
          </Pressable>
        </View>
      </View>
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
    maxWidth: 250,
  },
  subjectTitle: {
    color: "#1f2937",
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  mainContent: {
    marginTop: 20,
    height: 350,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
  },
  card: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 16,
    padding: 20,
    borderStyle: "dotted",
  },
  label: {
    width: "90%",
    textAlign: "left",
    fontSize: 22,
  },
  input: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    fontSize: 20,
    paddingHorizontal: 20,
    fontWeight: "semibold",
    backgroundColor: "#f1f1f1",
    borderWidth: 1,
    borderColor: "gray",
  },
  editableInput: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    fontSize: 20,
    paddingHorizontal: 20,
    fontWeight: "semibold",
    backgroundColor: "#f1f1f1",
    borderWidth: 1,
    borderColor: "gray",
  },
  saveButton: {
    height: 45,
    width: "90%",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#3b82f6",
  },
  saveButtonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
