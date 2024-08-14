import React from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import { useNotification } from "../context/NotificationContext";

export default function Notifications() {
  const { sendNotification } = useNotification();

  const handleSendNotification = () => {
    sendNotification("Test Notification", "This is a test notification");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Button title="Send Test Notification" onPress={handleSendNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
