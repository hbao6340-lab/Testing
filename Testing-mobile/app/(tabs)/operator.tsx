
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, FlatList, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Incident {
  id: string;
  type: string;
  location: string;
  status: 'emergency' | 'processing' | 'pending' | 'resolved';
  timestamp: string;
  phone: string;
  departments: string[];
}

interface ActivitySummary {
  totalIncidents: number;
  emergencyCount: number;
  processingCount: number;
  resolvedCount: number;
  responseTime: string;
  resolutionRate: number;
  departmentStats: { [key: string]: number };
  dateRange: string;
}

export default function OperatorDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [activitySummary, setActivitySummary] = useState<ActivitySummary | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: '2024-0012',
      type: 'Tai nạn giao thông nghiêm trọng',
      location: 'Ngã tư Lê Văn Việt - Nguyễn Văn Linh, Q.9',
      status: 'emergency',
      timestamp: '2 phút trước',
      phone: '0331234567',
      departments: ['Giao thông', 'Y tế', 'Cảnh sát']
    },
    {
      id: '2024-0011',
      type: 'Cháy nhỏ tại chung cư',
      location: 'Chung cư Sunrise City, Q.7',
      status: 'processing',
      timestamp: '15 phút trước',
      phone: '0912345678',
      departments: ['PCCC', 'Điện lực']
    },
    {
      id: '2024-0010',
      type: 'Mất nước sinh hoạt',
      location: 'Đường số 10, P. Tân Phú, Q.7',
      status: 'pending',
      timestamp: '30 phút trước',
      phone: '0987654321',
      departments: ['Cấp nước', 'Dân sự']
    },
    {
      id: '2024-0009',
      type: 'Cây đổ chắn đường',
      location: 'Công viên 23/9',
      status: 'resolved',
      timestamp: '1 giờ trước',
      phone: '0908123456',
      departments: ['Môi trường', 'Giao thông']
    }
  ]);

  const [stats, setStats] = useState({
    emergency: 12,
    processing: 24,
    total: 156,
    completion: 89
  });

  const handleLogin = () => {
    // Demo credentials - in production, this would be handled by backend
    if (username === 'operator' && password === 'password123') {
      setIsLoggedIn(true);
      generateActivitySummary();
    } else {
      Alert.alert('Lỗi đăng nhập', 'Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const generateActivitySummary = () => {
    const summary: ActivitySummary = {
      totalIncidents: 156,
      emergencyCount: 12,
      processingCount: 24,
      resolvedCount: 120,
      responseTime: '4.2 phút',
      resolutionRate: 89.7,
      departmentStats: {
        'PCCC': 34,
        'Giao thông': 42,
        'Y tế': 28,
        'Cảnh sát': 31,
        'Điện lực': 21
      },
      dateRange: `${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')} - ${new Date().toLocaleDateString('vi-VN')}`
    };
    setActivitySummary(summary);
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
      case 'emergency': return 'KHẨN CẤP';
      case 'processing': return 'ĐANG XỬ LÝ';
      case 'pending': return 'CHỜ XỬ LÝ';
      case 'resolved': return 'HOÀN THÀNH';
      default: return status;
    }
  };

  const handleIncidentAction = (incidentId: string, action: string) => {
    if (action === 'call') {
      const incident = incidents.find(i => i.id === incidentId);
      Alert.alert('Gọi điện', `Đang gọi số ${incident?.phone}`);
    } else if (action === 'complete') {
      setIncidents(incidents.map(incident => 
        incident.id === incidentId 
          ? { ...incident, status: 'resolved' as const }
          : incident
      ));
    } else if (action === 'assign') {
      Alert.alert('Phân công', 'Chọn phòng ban để phân công');
    }
  };

  const exportSummary = () => {
    if (!activitySummary) return;
    
    Alert.alert(
      'Xuất báo cáo',
      'Chọn hình thức xuất báo cáo:',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Gửi Email', 
          onPress: () => {
            Alert.alert('Thành công', 'Báo cáo đã được gửi qua email');
            setShowSummaryModal(false);
          }
        },
        { 
          text: 'Tải xuống', 
          onPress: () => {
            Alert.alert('Thành công', 'Báo cáo đã được tải xuống');
            setShowSummaryModal(false);
          }
        }
      ]
    );
  };

  // Auto-delete data after 30 days (simulation)
  useEffect(() => {
    const autoDeleteInterval = setInterval(() => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      // In production, this would delete old records from database
      console.log(`Auto-deleting records older than ${thirtyDaysAgo.toISOString()}`);
    }, 24 * 60 * 60 * 1000); // Check daily

    return () => clearInterval(autoDeleteInterval);
  }, []);

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.loginContainer}>
        <View style={styles.loginCard}>
          <View style={styles.loginHeader}>
            <View style={styles.loginIcon}>
              <Text style={styles.loginIconText}>🛡️</Text>
            </View>
            <Text style={styles.loginTitle}>ĐĂNG NHẬP</Text>
            <Text style={styles.loginSubtitle}>Hệ thống quản lý sự cố tích hợp</Text>
          </View>

          <View style={styles.loginForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tên đăng nhập</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIconText}>👤</Text>
                <TextInput
                  style={styles.loginInput}
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIconText}>🔒</Text>
                <TextInput
                  style={styles.loginInput}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonIcon}>🔑</Text>
              <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.demoInfo}>
            <Text style={styles.demoInfoIcon}>ℹ️</Text>
            <Text style={styles.demoText}>Tài khoản demo: operator / password123</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🎧</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>TRUNG TÂM ĐIỀU HÀNH</Text>
            <Text style={styles.headerSubtitle}>Hệ thống quản lý sự cố</Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIconText}>🔔</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.profileButton} onPress={handleLogout}>
            <Text style={styles.profileIconText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#ef4444' }]}>
              <Text style={styles.statIconText}>⚠️</Text>
            </View>
            <Text style={[styles.statNumber, { color: '#ef4444' }]}>{stats.emergency}</Text>
            <Text style={styles.statLabel}>Sự cố khẩn cấp</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#f59e0b' }]}>
              <Text style={styles.statIconText}>⏰</Text>
            </View>
            <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{stats.processing}</Text>
            <Text style={styles.statLabel}>Đang xử lý</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#3b82f6' }]}>
              <Text style={styles.statIconText}>📋</Text>
            </View>
            <Text style={[styles.statNumber, { color: '#3b82f6' }]}>{stats.total}</Text>
            <Text style={styles.statLabel}>Tổng sự cố</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#10b981' }]}>
              <Text style={styles.statIconText}>✅</Text>
            </View>
            <Text style={[styles.statNumber, { color: '#10b981' }]}>{stats.completion}%</Text>
            <Text style={styles.statLabel}>Hoàn thành</Text>
          </View>
        </View>

        {/* Activity Summary Button */}
        <View style={styles.summaryButtonContainer}>
          <TouchableOpacity 
            style={styles.summaryButton} 
            onPress={() => setShowSummaryModal(true)}
          >
            <Text style={styles.summaryButtonIconText}>📊</Text>
            <Text style={styles.summaryButtonText}>Tổng kết hoạt động</Text>
          </TouchableOpacity>
        </View>

        {/* Incident List */}
        <View style={styles.incidentContainer}>
          <View style={styles.incidentHeader}>
            <Text style={styles.incidentTitle}>Danh sách sự cố</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
                <Text style={styles.filterButtonText}>Tất cả</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>Mới nhất</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>Khẩn cấp</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={incidents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[
                styles.incidentItem,
                item.status === 'emergency' && styles.emergencyItem
              ]}>
                <View style={styles.incidentTop}>
                  <View style={styles.incidentInfo}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                    </View>
                    <Text style={[styles.incidentId, { color: getStatusColor(item.status) }]}>#{item.id}</Text>
                  </View>
                  <Text style={styles.incidentTime}>{item.timestamp}</Text>
                </View>

                <Text style={styles.incidentType}>{item.type}</Text>
                <Text style={styles.incidentLocation}>{item.location}</Text>

                <View style={styles.departmentTags}>
                  {item.departments.map((dept, index) => (
                    <View key={index} style={styles.departmentTag}>
                      <Text style={styles.departmentText}>{dept}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.incidentBottom}>
                  <Text style={styles.incidentPhone}>{item.phone}</Text>
                  <View style={styles.incidentActions}>
                    {item.status === 'processing' && (
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleIncidentAction(item.id, 'complete')}
                      >
                        <Text style={styles.actionIconText}>✅</Text>
                        <Text style={[styles.actionText, { color: '#10b981' }]}>Hoàn thành</Text>
                      </TouchableOpacity>
                    )}
                    {item.status === 'pending' && (
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleIncidentAction(item.id, 'assign')}
                      >
                        <Text style={styles.actionIconText}>👥</Text>
                        <Text style={[styles.actionText, { color: '#3b82f6' }]}>Phân công</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleIncidentAction(item.id, 'call')}
                    >
                      <Text style={styles.actionIconText}>📞</Text>
                      <Text style={[styles.actionText, { color: '#3b82f6' }]}>Gọi</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>

        {/* Department Quick Actions */}
        <View style={styles.departmentContainer}>
          <Text style={styles.departmentTitle}>Phân loại phòng ban</Text>
          <View style={styles.departmentGrid}>
            {[
              { name: 'PCCC', icon: '🔥', color: '#ef4444' },
              { name: 'Giao thông', icon: '🚗', color: '#3b82f6' },
              { name: 'Y tế', icon: '🏥', color: '#10b981' },
              { name: 'Điện lực', icon: '⚡', color: '#8b5cf6' },
              { name: 'Cấp nước', icon: '💧', color: '#06b6d4' },
              { name: 'Cảnh sát', icon: '🛡️', color: '#f59e0b' }
            ].map((dept, index) => (
              <TouchableOpacity key={index} style={[styles.departmentButton, { borderColor: dept.color }]}>
                <Text style={[styles.departmentIconText, { color: dept.color }]}>{dept.icon}</Text>
                <Text style={[styles.departmentButtonText, { color: dept.color }]}>{dept.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Activity Summary Modal */}
      <Modal
        visible={showSummaryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSummaryModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tổng kết hoạt động</Text>
            <TouchableOpacity onPress={() => setShowSummaryModal(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          {activitySummary && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryCardTitle}>Thống kê tổng quan</Text>
                <Text style={styles.summaryPeriod}>Thời gian: {activitySummary.dateRange}</Text>
                
                <View style={styles.summaryStats}>
                  <View style={styles.summaryStatItem}>
                    <Text style={styles.summaryStatNumber}>{activitySummary.totalIncidents}</Text>
                    <Text style={styles.summaryStatLabel}>Tổng số sự cố</Text>
                  </View>
                  <View style={styles.summaryStatItem}>
                    <Text style={[styles.summaryStatNumber, { color: '#ef4444' }]}>
                      {activitySummary.emergencyCount}
                    </Text>
                    <Text style={styles.summaryStatLabel}>Khẩn cấp</Text>
                  </View>
                  <View style={styles.summaryStatItem}>
                    <Text style={[styles.summaryStatNumber, { color: '#10b981' }]}>
                      {activitySummary.resolvedCount}
                    </Text>
                    <Text style={styles.summaryStatLabel}>Đã giải quyết</Text>
                  </View>
                </View>

                <View style={styles.summaryMetrics}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Thời gian phản hồi trung bình</Text>
                    <Text style={styles.metricValue}>{activitySummary.responseTime}</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Tỷ lệ giải quyết</Text>
                    <Text style={styles.metricValue}>{activitySummary.resolutionRate}%</Text>
                  </View>
                </View>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryCardTitle}>Thống kê theo phòng ban</Text>
                {Object.entries(activitySummary.departmentStats).map(([dept, count]) => (
                  <View key={dept} style={styles.deptStatItem}>
                    <Text style={styles.deptStatName}>{dept}</Text>
                    <Text style={styles.deptStatCount}>{count} sự cố</Text>
                  </View>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.exportButton} onPress={exportSummary}>
                  <Text style={styles.exportButtonIconText}>📤</Text>
                  <Text style={styles.exportButtonText}>Xuất báo cáo</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loginContainer: {
    flex: 1,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loginCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loginIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#3b82f6',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  loginForm: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  inputIcon: {
    marginRight: 12,
  },
  loginInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonIcon: {
    marginRight: 8,
    fontSize: 16,
    color: 'white',
  },
  loginIconText: {
    fontSize: 40,
    color: 'white',
  },
  inputIconText: {
    fontSize: 16,
    color: '#9ca3af',
    marginRight: 12,
  },
  demoInfoIcon: {
    fontSize: 14,
    color: '#3b82f6',
  },
  headerIconText: {
    fontSize: 20,
    color: 'white',
  },
  notificationIconText: {
    fontSize: 20,
    color: '#fbbf24',
  },
  profileIconText: {
    fontSize: 28,
    color: '#3b82f6',
  },
  statIconText: {
    fontSize: 20,
    color: 'white',
  },
  summaryButtonIconText: {
    fontSize: 20,
    color: 'white',
    marginRight: 8,
  },
  actionIconText: {
    fontSize: 14,
    color: '#3b82f6',
    marginRight: 4,
  },
  departmentIconText: {
    fontSize: 16,
  },
  modalCloseText: {
    fontSize: 20,
    color: '#6b7280',
  },
  exportButtonIconText: {
    fontSize: 16,
    color: 'white',
    marginRight: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
  },
  demoText: {
    fontSize: 14,
    color: '#3b82f6',
    marginLeft: 8,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#1f2937',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#3b82f6',
    borderRadius: 24,
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
    color: '#60a5fa',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    backgroundColor: '#374151',
    borderRadius: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  summaryButtonContainer: {
    marginBottom: 24,
  },
  summaryButton: {
    flexDirection: 'row',
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  incidentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  incidentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  activeFilter: {
    backgroundColor: '#3b82f6',
  },
  filterButtonText: {
    color: 'white',
    fontSize: 14,
  },
  incidentItem: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  emergencyItem: {
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  incidentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incidentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  incidentId: {
    fontSize: 14,
    fontWeight: '500',
  },
  incidentTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  incidentType: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  incidentLocation: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 8,
  },
  departmentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  departmentTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  departmentText: {
    color: 'white',
    fontSize: 12,
  },
  incidentBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incidentPhone: {
    fontSize: 12,
    color: '#9ca3af',
  },
  incidentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  departmentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  departmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  departmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  departmentButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  departmentButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  summaryCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  summaryPeriod: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  summaryStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  summaryMetrics: {
    gap: 12,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  deptStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  deptStatName: {
    fontSize: 14,
    color: '#1f2937',
  },
  deptStatCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  modalActions: {
    paddingVertical: 16,
  },
  exportButton: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
