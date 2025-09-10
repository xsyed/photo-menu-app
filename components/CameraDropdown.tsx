import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';

interface CameraDropdownProps {
  onTakePhoto: () => void;
  onSelectFromGallery: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function CameraDropdown({ onTakePhoto, onSelectFromGallery }: CameraDropdownProps) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleTakePhoto = () => {
    setIsDropdownVisible(false);
    onTakePhoto();
  };

  const handleSelectFromGallery = () => {
    setIsDropdownVisible(false);
    onSelectFromGallery();
  };

  const closeDropdown = () => {
    setIsDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Camera Button */}
      <TouchableOpacity style={styles.cameraButton} onPress={toggleDropdown}>
        <Image source={require('../assets/camera-icon.png')} style={styles.cameraIcon} />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <Pressable style={styles.modalOverlay} onPress={closeDropdown}>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleTakePhoto}>
              <Text style={styles.dropdownItemText}>📷 Take Photo</Text>
            </TouchableOpacity>
            
            <View style={styles.separator} />
            
            <TouchableOpacity style={styles.dropdownItem} onPress={handleSelectFromGallery}>
              <Text style={styles.dropdownItemText}>🖼️ Select from Gallery</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  cameraButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 24,
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100, // Adjust based on header height
    paddingRight: 20,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 200,
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
});
