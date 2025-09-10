import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { Photo, ViewMode } from '../types';

interface PhotoGridProps {
  photos: Photo[];
  viewMode: ViewMode;
  onPhotoPress: (photo: Photo) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const GRID_PADDING = 4;
const GRID_ITEM_MARGIN = 2;
const GRID_COLS = 2;
const GRID_ITEM_SIZE = (screenWidth - (GRID_PADDING * 2) - (GRID_ITEM_MARGIN * (GRID_COLS + 1))) / GRID_COLS;

export default function PhotoGrid({ photos, viewMode, onPhotoPress }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>📷</Text>
        <Text style={styles.emptyTitle}>No photos yet</Text>
        <Text style={styles.emptySubtitle}>Tap the camera button to add your first photo</Text>
      </View>
    );
  }

  const renderGridItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => onPhotoPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.gridImage} />
    </TouchableOpacity>
  );

  const renderListItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => onPhotoPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.listImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? GRID_COLS : 1}
        key={viewMode} // Force re-render when view mode changes
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: GRID_PADDING,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    margin: GRID_ITEM_MARGIN,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  listItem: {
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  listImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
});
