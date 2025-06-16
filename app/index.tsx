import { useEffect, useState } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Semester } from "@/types/types";
import { supabase } from "../utils/supabase";
import "../global.css";

export default function HomeScreen() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prepare = async () => {
      try {
        const { data, error } = await supabase.from("semesters_with_count").select("*");
        if (error) {
          console.error("Supabase error:", error);
        } else {
          setSemesters(data);
        }
      } catch (e) {
        console.warn("Error loading app:", e);
      } finally {
        setLoading(false);
      }
    };
    prepare();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/iconnobg.png")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Attendance App</Text>
      </View>

      {/* Main Content */}
      <ScrollView
        scrollEnabled
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        {
          loading && (
            <View style={{ height: 500, width: "100%", justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="small" color="#1f2937" style={{ transform: [{ scale: 2 }] }} />
            </View>
          )
        }
        {!loading && semesters.map((item, index) => (
          <Link
            key={index}
            style={styles.linkContainer}
            href={{
              pathname: "/semester/[name]",
              params: { name: item.name, semester_id: item.semester_id },
            }}
            asChild
          >
            <Pressable style={styles.semesterBox}>
              <Text style={{ position: "absolute", right: 10, bottom: 10, fontSize: 14, color: item.isActive == "1" ? "green" : "red" }}>{item.student_count} Students</Text>
              <View>
                <Text style={styles.semesterTitle}>{item.name}</Text>
                <Text style={styles.semesterSubtitle}>Semester</Text>
              </View>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1eee9",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 80,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: -5,
    backgroundColor: "#1f2937",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  logo: {
    width: 40,
    height: 80,
    resizeMode: "cover",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  scrollView: {
    width: "100%",
    marginTop: 15,
  },
  scrollContainer: {
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  linkContainer: {
    width: "100%",
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#f1f1f1",
  },
  semesterBox: {
    height: 100,
    borderTopWidth: 5,
    width: "100%",
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  semesterTitle: {
    backgroundColor: "#1f2937",
    paddingHorizontal: 20,
    paddingVertical: 3,
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    borderRadius: 10,
  },
  semesterSubtitle: {
    marginTop: 2,
    textAlign: "center",
    fontSize: 18,
  },
});
