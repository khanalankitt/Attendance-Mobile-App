import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router, useLocalSearchParams } from "expo-router";

export default function StudentReport() {
  const { name, subject, present, total, student_id } = useLocalSearchParams();
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

      <View style={styles.cardContainer}>
        <Link
          asChild
          style={styles.link}
          href={{
            pathname: "/calendar/calendar",
            params: { name, subject, student_id },
          }}
        >
          <Pressable>
            <View style={[styles.card, styles.dottedBorder]}>
              <View style={styles.cardRow}>
                <Text style={styles.cardText}>Total Days</Text>
                <Text style={styles.cardBoldText}>{total}</Text>
              </View>
              <View style={[styles.cardRow, styles.cardRowMargin]}>
                <Text style={styles.cardText}>Present Days</Text>
                <Text style={styles.cardBoldText}>{present}</Text>
              </View>
            </View>
          </Pressable>
        </Link>
      </View>

      <View style={styles.percentageContainer}>
        <View style={[styles.card, styles.dottedBorder, styles.percentageCard]}>
          <View style={styles.percentageContent}>
            <Text style={styles.percentageText}>Present Percentage</Text>
            <Text style={styles.percentageValue}>
              {isNaN(Math.round((Number(present) / Number(total)) * 100)) ? "0%" : `${Math.round((Number(present) / Number(total)) * 100)}%`}
            </Text>
          </View>
        </View>
      </View>

      <Link
        style={styles.link}
        asChild
        href={{
          pathname: "/edit/editDetails",
          params: { name, subject, present, student_id },
        }}
      >
        <Pressable style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
      </Link>
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
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  cardContainer: {
    height: 128,
    width: "100%",
    marginTop: 20,
  },
  link: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    height: "100%",
    width: "90%",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  dottedBorder: {
    borderStyle: "dotted",
  },
  cardRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardRowMargin: {
    marginTop: 16,
  },
  cardText: {
    fontSize: 18,
  },
  cardBoldText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  percentageContainer: {
    height: 128,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  percentageCard: {
    gap: 20,
  },
  percentageContent: {
    width: "90%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  percentageText: {
    fontSize: 24,
  },
  percentageValue: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 12,
  },
  editButton: {
    height: 50,
    width: "90%",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#3b82f6",
  },
  editButtonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
