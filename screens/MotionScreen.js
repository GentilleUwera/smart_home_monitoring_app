import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Accelerometer } from "expo-sensors";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const MotionScreen = () => {
  const [steps, setSteps] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [stepCounts, setStepCounts] = useState([0, 0, 0, 0, 0, 0, 0]);
  const navigation = useNavigation();
  const accelerationThreshold = 1.2;

  useEffect(() => {
    let subscription;
    Accelerometer.isAvailableAsync().then((result) => {
      if (result) {
        subscription = Accelerometer.addListener(({ x, y, z }) => {
          const acceleration = Math.sqrt(x * x + y * y + z * z);
          if (
            acceleration > accelerationThreshold &&
            Date.now() - lastTimestamp > 800
          ) {
            setLastTimestamp(Date.now());
            const currentDay = new Date().getDay();
            setSteps((prevSteps) => prevSteps + 1);
            const newStepCounts = [...stepCounts];
            newStepCounts[currentDay] += 1;
            setStepCounts(newStepCounts);
            setTimeout(() => {
              sendNotification("Step Count Update", "You took a step!");
            }, 1200);
          }
          if (acceleration > 2 * accelerationThreshold) {
            sendNotification(
              "Motion Detected",
              "Please beware of surroundings for any potential hazards."
            );
          }
        });
      } else {
        console.log("Accelerometer not available on this device");
      }
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [lastTimestamp]);

  const sendNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: { data: "optional data" },
      },
      trigger: null, // Send immediately
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Motion Tracker</Text>
      </View>
      <View style={styles.mainContent}>
        <View style={styles.stepCircle}>
          <FontAwesome5 name="walking" size={100} color="#ffffff" />
          <Text style={styles.stepCount}>{steps}</Text>
        </View>
        <Text style={styles.stepsLabel}>Total Steps</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("LineCharts", { stepCounts });
          }}
        >
          <MaterialCommunityIcons name="chart-line" size={24} color="#fff" />
          <Text style={styles.buttonText}>View Step Chart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0f7fa",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: "100%",
    padding: 20,
    backgroundColor: "#00796b",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircle: {
    width: 200,
    height: 200,
    backgroundColor: "#00796b",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  stepCount: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#ffffff",
  },
  stepsLabel: {
    fontSize: 24,
    color: "#00796b",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00796b",
    padding: 15,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffff",
    marginLeft: 10,
  },
});

export default MotionScreen;