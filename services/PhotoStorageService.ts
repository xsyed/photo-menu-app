import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Photo, ViewMode, STORAGE_KEYS } from '../types';

export class PhotoStorageService {
  private static PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;

  static async initializeStorage(): Promise<void> {
    // Ensure photos directory exists
    const dirInfo = await FileSystem.getInfoAsync(this.PHOTOS_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.PHOTOS_DIR, { 
        intermediates: true 
      });
    }
  }

  static async savePhoto(photoUri: string): Promise<Photo> {
    await this.initializeStorage();
    
    const timestamp = Date.now();
    const fileName = `photo-${timestamp}.jpg`;
    const newUri = `${this.PHOTOS_DIR}${fileName}`;
    
    // Copy photo to app's local storage
    await FileSystem.copyAsync({
      from: photoUri,
      to: newUri,
    });

    // Get image dimensions
    const imageInfo = await FileSystem.getInfoAsync(newUri);
    
    const photo: Photo = {
      id: `photo-${timestamp}`,
      fileName,
      uri: newUri,
      timestamp,
      width: 0, // Will be updated when we get actual dimensions
      height: 0,
    };

    // Save photo metadata
    await this.addPhotoToStorage(photo);
    
    return photo;
  }

  static async addPhotoToStorage(photo: Photo): Promise<void> {
    const photos = await this.getPhotos();
    photos.unshift(photo); // Add to beginning (newest first)
    await AsyncStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  }

  static async getPhotos(): Promise<Photo[]> {
    try {
      const photosJson = await AsyncStorage.getItem(STORAGE_KEYS.PHOTOS);
      if (!photosJson) return [];
      
      const photos: Photo[] = JSON.parse(photosJson);
      
      // Validate that files still exist
      const validPhotos: Photo[] = [];
      for (const photo of photos) {
        const fileInfo = await FileSystem.getInfoAsync(photo.uri);
        if (fileInfo.exists) {
          validPhotos.push(photo);
        }
      }
      
      // Update storage if some photos were removed
      if (validPhotos.length !== photos.length) {
        await AsyncStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(validPhotos));
      }
      
      return validPhotos;
    } catch (error) {
      console.error('Error loading photos:', error);
      return [];
    }
  }

  static async deletePhoto(photoId: string): Promise<void> {
    const photos = await this.getPhotos();
    const photoToDelete = photos.find(p => p.id === photoId);
    
    if (photoToDelete) {
      // Delete file
      try {
        await FileSystem.deleteAsync(photoToDelete.uri);
      } catch (error) {
        console.warn('Could not delete photo file:', error);
      }
      
      // Remove from metadata
      const updatedPhotos = photos.filter(p => p.id !== photoId);
      await AsyncStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(updatedPhotos));
    }
  }

  static async getViewMode(): Promise<ViewMode> {
    try {
      const viewMode = await AsyncStorage.getItem(STORAGE_KEYS.VIEW_MODE);
      return (viewMode as ViewMode) || 'grid';
    } catch (error) {
      console.error('Error loading view mode:', error);
      return 'grid';
    }
  }

  static async setViewMode(viewMode: ViewMode): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
    } catch (error) {
      console.error('Error saving view mode:', error);
    }
  }
}
