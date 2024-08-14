// MainContainer.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";

import GpsScreen from "../screens/GpsScreen";

import Notifications from "../screens/Notifications";
import TabNavigator from "./TabNavigator";

const Drawer = createDrawerNavigator();

function MainContainer() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Gps"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ route }) => ({
          drawerIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Gps") {
              iconName = "location-outline";
            } else if (route.name === "Notification") {
              iconName = "notifications-outline";
            } else if (route.name === "Tabs") {
              iconName = "home-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Drawer.Screen name="Gps" component={GpsScreen} />
        <Drawer.Screen name="Notification" component={Notifications} />
        <Drawer.Screen name="Tabs" component={TabNavigator} />
        {/* Add other drawer screens here */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.closeDrawer()}
      />
    </DrawerContentScrollView>
  );
}

export default MainContainer;
