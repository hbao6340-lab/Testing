import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapLocationPicker from '../../components/MapLocationPicker';

interface Report {
  id: string;
  type: string;
  location: string;
  status: 'pending' | 'processing' | 'resolved';
  timestamp: string;
  coordinates?: { lat: number; lng: number };
}

interface MediaItem {
  id: string;
  uri: string;
  type: 'image' | 'video';
}

interface LocationCoords {
  lat: number;
  lng: number;
}

export default function CitizenReportingApp() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [locationCoords, setLocationCoords] = useState<LocationCoords | null>(null);
  const [recentReports, setRecentReports] = useState<Report[]>([
    {
      id: '1',
      type: 'Tai nạn giao thông',
      location: 'Ngã tư Lê Văn Việt - Nguyễn Văn Linh',
      status: 'processing',
      timestamp: '10 phút trước'
    },
    {
      id: '2',
      type: 'Mất điện khu vực',
      location: 'Đường số 10, P. Tân Phú',
      status: 'resolved',
      timestamp: '2 giờ trước'
    }
  ]);

  const handleLocationSelect = (selectedAddress: string, latitude: number, longitude: number) => {
    setAddress(selectedAddress);
    setLocationCoords({ lat: latitude, lng: longitude });
  };

  const handleEmergencyReport = () => {
    Alert.alert(
      'Báo cáo khẩn cấp',
      'Bạn có chắc chắn muốn báo cáo sự cố khẩn cấp?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          style: 'destructive',
          onPress: () => {
            setDescription('SỰ CỐ KHẨN CẤP - CẦN HỖ TRỢ NGAY LẬP TỨC!');
          }
        }
      ]
    );
  };

  const handlePhoneVerification = () => {
    if (phoneNumber.length >= 10) {
      setShowVerification(true);
      // Simulate sending SMS
      Alert.alert('Mã xác thực', 'Mã xác thực đã được gửi đến số điện thoại của bạn');
    } else {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại hợp lệ');
    }
  };

  const verifyCode = () => {
    if (verificationCode === '123456') { // Demo verification
      setIsVerified(true);
      setShowVerification(false);
      Alert.alert('Thành công', 'Số điện thoại đã được xác thực');
    } else {
      Alert.alert('Lỗi', 'Mã xác thực không đúng');
    }
  };

  // This function is no longer directly used by the UI but is kept for potential future use or as a fallback.
  const getCurrentLocation = async () => {
    try {
      // Mock location for demo purposes if MapLocationPicker fails or is not used
      const mockAddress = "123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM";
      const mockCoords = { lat: 10.762622, lng: 106.682187 }; // Example coordinates
      setAddress(mockAddress);
      setLocationCoords(mockCoords);
      Alert.alert('Thành công', 'Đã lấy vị trí hiện tại (mô phỏng)');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy vị trí hiện tại');
    }
  };

  const pickImage = async () => {
    Alert.alert('Chức năng tạm thời', 'Chức năng chọn ảnh đang được phát triển');
  };

  const takePhoto = async () => {
    Alert.alert('Chức năng tạm thời', 'Chức năng chụp ảnh đang được phát triển');
  };

  const removeMedia = (id: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };

  const submitReport = () => {
    if (!isVerified) {
      Alert.alert('Thông báo', 'Vui lòng xác thực số điện thoại trước khi gửi báo cáo');
      return;
    }

    if (!address.trim() || !description.trim()) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Simulate report submission with location coordinates
    const newReport: Report = {
      id: Date.now().toString(),
      type: description.includes('KHẨN CẤP') ? 'Sự cố khẩn cấp' : 'Báo cáo thường',
      location: address,
      status: 'pending',
      timestamp: 'Vừa xong',
      coordinates: locationCoords
    };

    setRecentReports([newReport, ...recentReports]);

    // Reset form
    setAddress('');
    setDescription('');
    setMediaItems([]);
    setLocationCoords(null);

    Alert.alert(
      'Thành công',
      locationCoords
        ? `Báo cáo đã được gửi với tọa độ: ${locationCoords.lat.toFixed(6)}, ${locationCoords.lng.toFixed(6)}`
        : 'Báo cáo của bạn đã được gửi thành công!'
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'emergency': return '#ef4444';
      case 'processing': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing': return 'Đang xử lý';
      case 'pending': return 'Chờ xử lý';
      case 'resolved': return 'Đã giải quyết';
      default: return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Text style={styles.headerIconText}>🛡️</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>BÁO CÁO SỰ CỐ</Text>
              <Text style={styles.headerSubtitle}>Ứng dụng công dân</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIconText}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Emergency Button */}
        <View style={styles.emergencyContainer}>
          <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyReport}>
            <Text style={styles.emergencyIcon}>⚠️</Text>
            <Text style={styles.emergencyText}>BÁO CÁO KHẨN CẤP</Text>
          </TouchableOpacity>
        </View>

        {/* Report Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Báo cáo sự cố</Text>

          {/* Phone Number Verification */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại *</Text>
            <View style={styles.phoneContainer}>
              <TextInput
                style={[styles.input, styles.phoneInput]}
                placeholder="Nhập số điện thoại của bạn"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                editable={!isVerified}
              />
              <TouchableOpacity
                style={[styles.verifyButton, isVerified && styles.verifiedButton]}
                onPress={isVerified ? undefined : handlePhoneVerification}
                disabled={isVerified}
              >
                <Text style={styles.verifyButtonText}>
                  {isVerified ? 'Đã xác thực' : 'Xác thực'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Verification Code Input */}
          {showVerification && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mã xác thực</Text>
              <View style={styles.phoneContainer}>
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  placeholder="Nhập mã xác thực"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <TouchableOpacity style={styles.verifyButton} onPress={verifyCode}>
                  <Text style={styles.verifyButtonText}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ *</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Nhập địa chỉ hoặc chọn trên bản đồ"
              value={address}
              onChangeText={setAddress}
              multiline
            />
            <MapLocationPicker 
              onLocationSelect={handleLocationSelect}
              currentAddress={address}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mô tả sự cố *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mô tả chi tiết sự cố..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Media Attachments */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Đính kèm phương tiện</Text>
            <View style={styles.mediaButtons}>
              <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
                <Text style={styles.mediaIconText}>📷</Text>
                <Text style={styles.mediaButtonText}>Chụp ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
                <Text style={styles.mediaIconText}>🖼️</Text>
                <Text style={styles.mediaButtonText}>Chọn từ thư viện</Text>
              </TouchableOpacity>
            </View>

            {/* Media Preview */}
            {mediaItems.length > 0 && (
              <View style={styles.mediaPreview}>
                {mediaItems.map((item) => (
                  <View key={item.id} style={styles.mediaItem}>
                    <Image source={{ uri: item.uri }} style={styles.mediaImage} />
                    <TouchableOpacity
                      style={styles.removeMediaButton}
                      onPress={() => removeMedia(item.id)}
                    >
                      <Text style={styles.removeIconText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
            <Text style={styles.submitButtonText}>GỬI BÁO CÁO</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Reports */}
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Báo cáo gần đây</Text>
          {recentReports.map((report) => (
            <View key={report.id} style={styles.reportItem}>
              <View style={styles.reportHeader}>
                <Text style={styles.reportType}>{report.type}</Text>
                <Text style={styles.reportTime}>{report.timestamp}</Text>
              </View>
              <Text style={styles.reportLocation}>{report.location}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                <Text style={styles.statusText}>{getStatusText(report.status)}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, { color: '#3b82f6' }]}>🏠</Text>
          <Text style={[styles.navText, { color: '#3b82f6' }]}>Trang chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, { color: '#6b7280' }]}>⏰</Text>
          <Text style={styles.navText}>Lịch sử</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingButton} onPress={handleEmergencyReport}>
          <Text style={styles.floatingIcon}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, { color: '#6b7280' }]}>🗺️</Text>
          <Text style={styles.navText}>Bản đồ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, { color: '#6b7280' }]}>👤</Text>
          <Text style={styles.navText}>Tài khoản</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  menuButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  emergencyContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emergencyButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  emergencyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInput: {
    flex: 1,
    marginRight: 12,
  },
  verifyButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  verifiedButton: {
    backgroundColor: '#10b981',
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressInput: {
    flex: 1,
    marginRight: 12,
  },
  locationButton: {
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginTop: 0,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaButtonText: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 8,
  },
  mediaPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  mediaItem: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  mediaImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeMediaButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  reportItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    paddingLeft: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reportType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  reportTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  reportLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  floatingButton: {
    position: 'absolute',
    top: -32,
    left: '50%',
    marginLeft: -32,
    width: 64,
    height: 64,
    backgroundColor: '#ef4444',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  headerIconText: {
    fontSize: 20,
    color: '#1e40af',
  },
  menuIconText: {
    fontSize: 20,
    color: 'white',
  },
  emergencyIcon: {
    fontSize: 20,
    color: 'white',
    marginRight: 8,
  },
  locationIconText: {
    fontSize: 16,
    color: '#3b82f6',
  },
  mediaIconText: {
    fontSize: 28,
    color: '#6b7280',
  },
  removeIconText: {
    fontSize: 12,
    color: 'white',
  },
  navIcon: {
    fontSize: 20,
  },
  floatingIcon: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
});