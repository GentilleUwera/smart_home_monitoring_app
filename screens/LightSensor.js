// src/screens/LightSensor.js
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import * as Sensors from "expo-sensors";
import LightLevelGraph from "../components/LightLevelGraph";
import { useNotification } from "../context/NotificationContext";
import { Ionicons } from "@expo/vector-icons";

export default function LightSensor({ navigation }) {
  const [lightLevel, setLightLevel] = useState(0);
  const [isScreenCovered, setIsScreenCovered] = useState(false);
  const { sendNotification } = useNotification();

  const SCREEN_COVER_THRESHOLD = 10;
  const LOW_LIGHT_THRESHOLD = 10;
  const HIGH_LIGHT_THRESHOLD = 10000;

  useEffect(() => {
    let subscription;

    const enableSensor = async () => {
      await Sensors.LightSensor.setUpdateInterval(1000);
      subscription = Sensors.LightSensor.addListener((data) => {
        setLightLevel(data.illuminance);
        checkScreenCover(data.illuminance);
        manageNotifications(data.illuminance);
      });
    };

    enableSensor();

    return () => {
      subscription && subscription.remove();
    };
  }, []);

  const checkScreenCover = (illuminance) => {
    setIsScreenCovered(illuminance <= SCREEN_COVER_THRESHOLD);
  };

  const manageNotifications = (illuminance) => {
    if (illuminance <= LOW_LIGHT_THRESHOLD) {
      sendNotification("Low light", "The Light is too low.");
    } else if (illuminance > HIGH_LIGHT_THRESHOLD) {
      sendNotification("High light", "The light is too bright.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <LightLevelGraph lightLevel={lightLevel} />

      <View style={styles.statusContainer}>
        <Ionicons
          name={isScreenCovered ? "eye-off" : "eye"}
          size={24}
          color={isScreenCovered ? "#e74c3c" : "#2ecc71"}
        />
        <Text style={styles.statusText}>
          {isScreenCovered
            ? "Screen covered"
            : `Current light level: ${lightLevel.toFixed(2)} lux`}
        </Text>
      </View>

      <Text style={styles.threshold}>
        Screen is covered below {SCREEN_COVER_THRESHOLD} lux
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f3f4",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 10,
    backgroundColor: "#2c3e50",
    borderRadius: 50,
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  statusText: {
    fontSize: 18,
    marginLeft: 10,
  },
  threshold: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 5,
  },
});
