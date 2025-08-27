
import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Modal, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

interface MapLocationPickerProps {
  onLocationSelect: (address: string, latitude: number, longitude: number) => void;
  currentAddress?: string;
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function MapLocationPicker({ onLocationSelect, currentAddress }: MapLocationPickerProps) {
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [region, setRegion] = useState<Region>({
    latitude: 10.8231, // Ho Chi Minh City
    longitude: 106.6297,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef<MapView>(null);

  // LocationIQ API key
  const LOCATIONIQ_API_KEY = 'pk.149de87cb1db8bf504f953c2ef6264f1';

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      return data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      console.log('Reverse geocoding failed:', error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Lỗi quyền', 'Cần cấp quyền truy cập vị trí để sử dụng tính năng này');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      
      // Update map region
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(newRegion);
      
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }

      // Set selected location
      setSelectedLocation({ lat: latitude, lng: longitude });
      
      // Get address
      const address = await reverseGeocode(latitude, longitude);
      setSelectedAddress(address);

      if (!showMap) {
        // If map is not open, directly return the location
        onLocationSelect(address, latitude, longitude);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy vị trí hiện tại. Vui lòng thử lại.');
    }
  };

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ lat: latitude, lng: longitude });
    
    const address = await reverseGeocode(latitude, longitude);
    setSelectedAddress(address);
  };

  const confirmLocation = () => {
    if (selectedLocation && selectedAddress) {
      onLocationSelect(selectedAddress, selectedLocation.lat, selectedLocation.lng);
      setShowMap(false);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.mapButton} onPress={() => setShowMap(true)}>
        <Text style={styles.mapButtonIcon}>🗺️</Text>
        <Text style={styles.mapButtonText}>Chọn trên bản đồ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
        <Text style={styles.locationButtonIcon}>📍</Text>
        <Text style={styles.locationButtonText}>Vị trí hiện tại</Text>
      </TouchableOpacity>

      <Modal
        visible={showMap}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowMap(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.mapHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowMap(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.mapTitle}>Chọn vị trí</Text>
            <TouchableOpacity style={styles.currentLocationButton} onPress={getCurrentLocation}>
              <Text style={styles.currentLocationText}>📍</Text>
            </TouchableOpacity>
          </View>

          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={region}
            onPress={handleMapPress}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            showsScale={true}
          >
            {selectedLocation && (
              <Marker
                coordinate={{
                  latitude: selectedLocation.lat,
                  longitude: selectedLocation.lng,
                }}
                title="Vị trí đã chọn"
                description={selectedAddress}
              />
            )}
          </MapView>

          {selectedLocation && (
            <View style={styles.locationInfo}>
              <Text style={styles.selectedAddressText} numberOfLines={2}>
                {selectedAddress}
              </Text>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmLocation}>
                <Text style={styles.confirmButtonText}>Xác nhận vị trí này</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  mapButtonIcon: {
    fontSize: 16,
    color: 'white',
    marginRight: 8,
  },
  mapButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  locationButtonIcon: {
    fontSize: 16,
    color: 'white',
    marginRight: 8,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#3b82f6',
    paddingTop: 50, // Account for status bar
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentLocationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationText: {
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  locationInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedAddressText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
