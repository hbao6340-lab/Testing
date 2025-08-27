
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';

interface LocationIQSetupProps {
  visible: boolean;
  onClose: () => void;
}

export default function LocationIQSetup({ visible, onClose }: LocationIQSetupProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cài đặt LocationIQ API</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Tạo tài khoản LocationIQ</Text>
              <Text style={styles.stepText}>
                Truy cập https://locationiq.com và đăng ký tài khoản miễn phí
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Lấy API Key</Text>
              <Text style={styles.stepText}>
                Sau khi đăng ký, vào Dashboard và copy API key của bạn
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Thay thế API Key</Text>
              <Text style={styles.stepText}>
                Mở file components/MapLocationPicker.tsx và thay thế 'pk.locationiq_api_key_here' bằng API key của bạn
              </Text>
            </View>
          </View>

          <View style={styles.note}>
            <Text style={styles.noteIcon}>⚠️</Text>
            <Text style={styles.noteText}>
              Lưu ý: LocationIQ cung cấp 5,000 requests miễn phí mỗi tháng. 
              Trong môi trường production, hãy bảo mật API key của bạn.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeText: {
    fontSize: 20,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  note: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  noteIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
});
