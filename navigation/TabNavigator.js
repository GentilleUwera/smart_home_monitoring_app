// TabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import LightSensor from "../screens/LightSensor";
import MotionScreen from "../screens/MotionScreen";
import Chart from "../screens/Chart";

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "LightSensor") {
            iconName = "sunny-outline";
          } else if (route.name === "MotionScreen") {
            iconName = "walk-outline";
          } else if (route.name === "Chart") {
            iconName = "bar-chart-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="LightSensor" component={LightSensor} />
      <Tab.Screen name="MotionScreen" component={MotionScreen} />
      <Tab.Screen name="Chart" component={Chart} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
