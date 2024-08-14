import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, Alert, StatusBar } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ... (keep the existing constants)
const homeLocation = {
  latitude: -1.927527, 
  longitude: 30.044904,
};

const schoolLocation = {
  latitude: -1.955549,
  longitude: 30.104357,
};

const homeRadius = 50; // In meters
const schoolRadius = 50;

async function SendPushNotification(title, message) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: message,
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}


const ORANGE = '#FF8C00';
const RED = "red";
export default function App() {
  const mapRef = useRef(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: -1.97420,
    longitude: 30.04718,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      await Notifications.requestPermissionsAsync();
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
      await startWatchingLocation();
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const startWatchingLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Location permission denied');
      Alert.alert('Permission Denied', 'Location permission is required for this app to work.');
      return;
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      },
      (location) => {
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        checkLocationBounds(location.coords.latitude, location.coords.longitude);
      }
    );

    setLocationSubscription(subscription);
  };

  const checkLocationBounds = (latitude, longitude) => {
    const distanceFromHome = calculateDistance(homeLocation.latitude, homeLocation.longitude, latitude, longitude);
    const distanceFromSchool = calculateDistance(schoolLocation.latitude, schoolLocation.longitude, latitude, longitude);

    if (distanceFromHome <= homeRadius) {
      SendPushNotification('Location Alert', 'You have reached home');
    } else if (distanceFromSchool <= schoolRadius) {
      SendPushNotification('Location Alert', 'You have reached school');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance * 1000;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const onMapReady = () => {
    setMapLoaded(true);
  };

  const zoomIn = () => {
    mapRef.current?.getCamera().then((cam) => {
      cam.zoom += 1;
      mapRef.current?.animateCamera(cam);
    });
  };

  const zoomOut = () => {
    mapRef.current?.getCamera().then((cam) => {
      cam.zoom -= 1;
      mapRef.current?.animateCamera(cam);
    });
  };

  const handleSearch = async () => {
    try {
      const result = await Location.geocodeAsync(searchQuery);
      if (result.length > 0) {
        const { latitude, longitude } = result[0];
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        Alert.alert('Location not found', 'Please try a different search term.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      Alert.alert('Error', 'Unable to find the location. Please try again.');
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MapView 
        ref={mapRef}
        style={styles.map} 
        region={mapRegion}
        mapType={mapType}
        provider={PROVIDER_GOOGLE}
        onMapReady={onMapReady}
        onError={(error) => console.error("Map error:", error)}
        showsCompass={false}
      >
        {mapLoaded && (
          <>
            <Marker coordinate={mapRegion} title="Current Location">
              <View style={styles.markerContainer}>
                <Ionicons name="location" size={30} color={RED} />
              </View>
            </Marker>
            <Marker coordinate={homeLocation} title="Home">
              <View style={styles.markerContainer}>
                <Ionicons name="home" size={30} color={ORANGE} />
              </View>
            </Marker>
            <Marker coordinate={schoolLocation} title="School">
              <View style={styles.markerContainer}>
                <Ionicons name="school" size={30} color={ORANGE} />
              </View>
            </Marker>
            <Circle
              center={homeLocation}
              radius={homeRadius}
              strokeWidth={2}
              strokeColor={ORANGE}
              fillColor="rgba(255,140,0,0.1)"
            />
            <Circle
              center={schoolLocation}
              radius={schoolRadius}
              strokeWidth={2}
              strokeColor={ORANGE}
              fillColor="rgba(255,140,0,0.1)"
            />
          </>
        )}
      </MapView>
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'transparent']}
        style={styles.topGradient}
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search location..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View style={styles.compassContainer}>
        <TouchableOpacity style={styles.compassButton}>
          <MaterialCommunityIcons name="compass" size={30} color={ORANGE} />
        </TouchableOpacity>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleMapType}>
          <Ionicons name={mapType === 'standard' ? 'map' : 'globe'} size={24} color={ORANGE} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={zoomIn}>
          <Ionicons name="add" size={24} color={ORANGE} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={zoomOut}>
          <Ionicons name="remove" size={24} color={ORANGE} />
        </TouchableOpacity>
      </View>
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      {!mapLoaded && <Text style={styles.loadingText}>Loading map...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: StatusBar.currentHeight + 10,
    marginHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: ORANGE,
    padding: 12,
    borderRadius: 25,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassContainer: {
    position: 'absolute',
    top: 120,
    right: 20,
  },
  compassButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 30,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButton: {
    padding: 10,
    marginVertical: 5,
  },
  errorText: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
    color: 'white',
    textAlign: 'center',
  },
  loadingText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: 10,
    borderRadius: 5,
  },
  markerContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});