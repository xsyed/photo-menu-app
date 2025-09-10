import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import 'react-native-gesture-handler';

import { Photo, ViewMode } from './types';
import { PhotoStorageService } from './services/PhotoStorageService';
import PhotoGrid from './components/PhotoGrid';
import CameraScreen from './components/CameraScreen';
import PhotoViewer from './components/PhotoViewer';
import CameraDropdown from './components/CameraDropdown';

const Stack = createStackNavigator();

type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  PhotoViewer: { photo: Photo };
};

function HomeScreen({ navigation }: any) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadData();
  }, []);

  // Reload photos when screen comes into focus (e.g., returning from camera)
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [loadedPhotos, loadedViewMode] = await Promise.all([
        PhotoStorageService.getPhotos(),
        PhotoStorageService.getViewMode(),
      ]);
      setPhotos(loadedPhotos);
      setViewMode(loadedViewMode);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load photos');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoSaved = (newPhoto: Photo) => {
    setPhotos(current => [newPhoto, ...current]);
    navigation.goBack();
  };

  const handlePhotoPress = (photo: Photo) => {
    navigation.navigate('PhotoViewer', { photo });
  };

  const handleDeletePhoto = (photo: Photo) => {
    Alert.alert(
      'Delete Photo',
      'Delete this photo? This action cannot be undone.',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await PhotoStorageService.deletePhoto(photo.id);
              setPhotos(current => current.filter(p => p.id !== photo.id));
            } catch (error) {
              console.error('Error deleting photo:', error);
              Alert.alert('Error', 'Failed to delete photo');
            }
          },
        },
      ]
    );
  };

  const toggleViewMode = async () => {
    const newViewMode: ViewMode = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(newViewMode);
    await PhotoStorageService.setViewMode(newViewMode);
  };

  const openCamera = () => {
    navigation.navigate('Camera');
  };

  const selectFromGallery = async () => {
    try {
      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker with multiple selection enabled
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10, // Allow up to 10 images
      });

      if (!result.canceled && result.assets) {
        // Process each selected image
        const newPhotos: Photo[] = [];
        
        for (const asset of result.assets) {
          try {
            // Resize and optimize the image
            const manipulatedImage = await ImageManipulator.manipulateAsync(
              asset.uri,
              [{ resize: { width: 2048 } }], // Resize to max width of 2048px
              { 
                compress: 0.8, 
                format: ImageManipulator.SaveFormat.JPEG 
              }
            );

            // Save the photo
            const photo = await PhotoStorageService.savePhoto(manipulatedImage.uri);
            newPhotos.push(photo);
          } catch (error) {
            console.error('Error processing image:', error);
          }
        }

        if (newPhotos.length > 0) {
          // Add new photos to the current list
          setPhotos(current => [...newPhotos, ...current]);
          
        }
      }
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      Alert.alert('Error', 'Failed to select photos from gallery');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header with safe area padding */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Photo Menu</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.viewToggleButton} onPress={toggleViewMode}>
            <Text style={styles.viewToggleText}>
              {viewMode === 'grid' ? '☰' : '⊞'}
            </Text>
          </TouchableOpacity>
          <CameraDropdown 
            onTakePhoto={openCamera}
            onSelectFromGallery={selectFromGallery}
          />
        </View>
      </View>

      {/* Photo Grid */}
      <PhotoGrid
        photos={photos}
        viewMode={viewMode}
        onPhotoPress={handlePhotoPress}
      />
    </View>
  );
}

function CameraScreenWrapper({ navigation }: any) {
  const handlePhotoSaved = (photo: Photo) => {
    // Navigate back to home - the home screen will reload photos automatically
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <CameraScreen
      onPhotoSaved={handlePhotoSaved}
      onCancel={handleCancel}
    />
  );
}

function PhotoViewerScreen({ route, navigation }: any) {
  const { photo } = route.params;

  const handleClose = () => {
    navigation.goBack();
  };

  const handleDelete = (photoToDelete: Photo) => {
    Alert.alert(
      'Delete Photo',
      'Delete this photo? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await PhotoStorageService.deletePhoto(photoToDelete.id);
              navigation.goBack(); // Navigate back after successful deletion
            } catch (error) {
              console.error('Error deleting photo:', error);
              Alert.alert('Error', 'Failed to delete photo');
            }
          },
        },
      ]
    );
  };

  return <PhotoViewer photo={photo} onClose={handleClose} onDelete={handleDelete} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen 
            name="Camera" 
            component={CameraScreenWrapper}
            options={{
              presentation: 'modal',
            }}
          />
          <Stack.Screen 
            name="PhotoViewer" 
            component={PhotoViewerScreen}
            options={{
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewToggleButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  viewToggleText: {
    fontSize: 18,
    color: '#333',
  },

});
