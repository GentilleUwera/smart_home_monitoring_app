import React from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const LightLevelGraph = ({ lightLevel }) => {
  const percentage = (lightLevel / 30000) * 100;

  const getColor = (percent) => {
    if (percent < 25) return ["#3498db", "#2980b9"];
    if (percent < 50) return ["#f1c40f", "#f39c12"];
    if (percent < 75) return ["#e67e22", "#d35400"];
    return ["#e74c3c", "#c0392b"];
  };

  const colors = getColor(percentage);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Light Sensor</Text>

      <View style={styles.circularProgressContainer}>
        <AnimatedCircularProgress
          size={250}
          width={25}
          fill={percentage}
          tintColor={colors[0]}
          backgroundColor="#ecf0f1"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <LinearGradient colors={colors} style={styles.innerContainer}>
              <Ionicons name="sunny" size={50} color="#fff" />
              <Text style={styles.percentageText}>
                {percentage.toFixed(0)}%
              </Text>
              <Text style={styles.luxText}>{lightLevel.toFixed(0)} lux</Text>
            </LinearGradient>
          )}
        </AnimatedCircularProgress>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Light Level Info:</Text>
        <Text style={styles.infoText}>0-50 lux: Very dark</Text>
        <Text style={styles.infoText}>50-200 lux: Dark indoors</Text>
        <Text style={styles.infoText}>200-400 lux: Dim indoors</Text>
        <Text style={styles.infoText}>400-1000 lux: Normal indoors</Text>
        <Text style={styles.infoText}>1000-20000 lux: Daylight</Text>
        <Text style={styles.infoText}>20000+ lux: Direct sunlight</Text>
      </View>

      <View style={styles.colorBarContainer}>
        <Text style={styles.colorBarLabel}>Low</Text>
        <View style={styles.colorBar}>
          {["#3498db", "#f1c40f", "#e67e22", "#e74c3c"].map((color, index) => (
            <View
              key={index}
              style={[styles.colorSegment, { backgroundColor: color }]}
            />
          ))}
        </View>
        <Text style={styles.colorBarLabel}>High</Text>
      </View>
      <Text style={styles.rangeText}>Range: 0 - 30,000 lux</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  circularProgressContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  innerContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  percentageText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  luxText: {
    fontSize: 18,
    marginTop: 5,
    color: "#fff",
  },
  infoContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "stretch",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50",
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#34495e",
  },
  colorBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  colorBar: {
    flexDirection: "row",
    height: 20,
    width: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  colorSegment: {
    flex: 1,
  },
  colorBarLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  rangeText: {
    marginTop: 10,
    fontSize: 14,
    color: "#7f8c8d",
  },
});

export default LightLevelGraph;