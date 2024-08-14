// src/context/NotificationContext.js
import React, { createContext, useContext, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  useEffect(() => {
    registerForPushNotificationsAsync();
    
    const notificationListener = Notifications.addNotificationReceivedListener(handleNotification);
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  const handleNotification = notification => {
    console.log(notification);
    // Handle foreground notifications here
  };

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  };

  const sendNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { seconds: 1 },
    });
  };

  return (
    <NotificationContext.Provider value={{ sendNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};