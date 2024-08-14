import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import * as Brightness from 'expo-brightness';
import * as Sensors from 'expo-sensors';
import { useIsFocused } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { sendPushNotification } from './Notifications';
import { StatusBar } from 'expo-status-bar';
import { LineChart } from 'react-native-chart-kit';

const LIGHT_SENSOR_THRESHOLD = 10;
const BRIGHTNESS_THRESHOLD = 5000;
const MOTION_THRESHOLD = 0.5;

const LightSensor = () => {
  const [lightLevel, setLightLevel] = useState(0);
  const [isScreenCovered, setIsScreenCovered] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [motionDetected, setMotionDetected] = useState(false);
  const [accelerometerData, setAccelerometerData] = useState([]);
  const isFocused = useIsFocused();
  const currentBrightnessRef = useRef();
  const debounceTimerRef = useRef(null);
  const accelerometerSubscription = useRef(null);

  useEffect(() => {
    requestPermissions();
    return () => {
      cleanupListeners();
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      checkScreenCover(lightLevel);
      checkMotion(accelerometerData[accelerometerData.length - 1]);
    }
  }, [isFocused, lightLevel, accelerometerData]);

  useEffect(() => {
    if (lightLevel <= LIGHT_SENSOR_THRESHOLD) {
      setIsScreenCovered(true);
      setNotificationSent(false);
    }

    manageNotifications();
  }, [lightLevel]);

  const setupListeners = () => {
    setupLightSensorListener();
    setupAccelerometerListener();
  };

  const setupLightSensorListener = () => {
    lightSensorListener.current = Sensors.LightSensor.addListener(({ illuminance }) => {
      setLightLevel(illuminance);
    });
  };

  const setupAccelerometerListener = () => {
    accelerometerSubscription.current = Sensors.Accelerometer.addListener((accelerometerData) => {
      setAccelerometerData((prevData) => [...prevData, accelerometerData]);
    });
  };

  const cleanupListeners = () => {
    if (lightSensorListener.current) {
      lightSensorListener.current.remove();
    }
    if (accelerometerSubscription.current) {
      accelerometerSubscription.current.remove();
    }
  };

  const fetchBrightness = async () => {
    try {
      currentBrightnessRef.current = await Brightness.getBrightnessAsync();
    } catch (error) {
      console.error('Error fetching brightness:', error);
    }
  };

  const manageNotifications = () => {
    if (lightLevel > BRIGHTNESS_THRESHOLD && !notificationSent) {
      debounceNotification('Sensors App - Light', 'The environment is too bright.');
    }
  };

  const checkScreenCover = async (illuminance) => {
    if (illuminance <= LIGHT_SENSOR_THRESHOLD) {
      try {
        setIsScreenCovered(true);
        await turnOffScreen();
      } catch (error) {
        console.error(error);
      } finally {
        setNotificationSent(false);
      }
      return;
    }

    setIsScreenCovered(false);
    await restoreBrightness();
  };

  const checkMotion = (accelerometerData) => {
    const { x, y, z } = accelerometerData;
    const acceleration = Math.sqrt(x * x + y * y + z * z);

    if (acceleration > MOTION_THRESHOLD && !motionDetected) {
      setMotionDetected(true);
      debounceNotification('Motion Detected', 'Unexpected movement detected.');
} else if (acceleration <= MOTION_THRESHOLD && motionDetected) {
      setMotionDetected(false);
    }
  };

  const debounceNotification = (title, body) => {
    try {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        sendPushNotification(title, body);
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setNotificationSent(true);
    }
  };

  const restoreBrightness = async () => {
    if (currentBrightnessRef.current!== undefined) {
      try {
        await Brightness.setSystemBrightnessAsync(currentBrightnessRef.current);
      } catch (error) {
        console.error('Error setting brightness:', error);
      }
    }
  };

  const turnOffScreen = async () => {
    try {
      await Brightness.setSystemBrightnessAsync(0);
    } catch (error) {
      console.error('Error turning off screen:', error);
    }
  };

  const percentage = (lightLevel / 30000) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Light and Motion Sensor</Text>

      <AnimatedCircularProgress
        size={300}
        width={30}
        fill={percentage}
        tintColor="tomato"
        backgroundColor="gray"
        rotation={270}
        arcSweepAngle={180}
      >
        {() => (
          <>
            <Text style={{ fontSize: 44, margin: 35, fontFamily: 'ans-serif-light' }}>
              {percentage.toFixed(2)}%
            </Text>
            <Text>Range: [0 - 30,000] lux </Text>
            <Text style={styles.lightLevel}>Light level: {lightLevel.toFixed(2) + 'ux'}</Text>
          </>
        )}
      </AnimatedCircularProgress>

      <Text style={styles.lightLevel}>
        {isScreenCovered? (
          'Screen covered'
        ) : (
          <Text style={styles.threshold}>Screen is covered below {LIGHT_SENSOR_THRESHOLD} lux!</Text>
        )}
      </Text>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Accelerometer Data</Text>
        <LineChart
          data={{
            datasets: [
              {
                data: accelerometerData.map((data) => data.x),
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              },
              {
                data: accelerometerData.map((data) => data.y),
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
              },
              {
                data: accelerometerData.map((data) => data.z),
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
              },
            ],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
          }}
        />
      </View>
    </View>
  );
};

export default LightSensor;