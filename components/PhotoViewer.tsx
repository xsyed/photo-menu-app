import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Photo } from '../types';

interface PhotoViewerProps {
  photo: Photo;
  onClose: () => void;
  onDelete?: (photo: Photo) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PhotoViewer({ photo, onClose, onDelete }: PhotoViewerProps) {
  const scale = useSharedValue(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const insets = useSafeAreaInsets();

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(1, Math.min(event.scale, 3));
    })
    .onEnd(() => {
      if (scale.value < 1.2) {
        scale.value = withSpring(1);
        runOnJS(setIsZoomed)(false);
      } else {
        runOnJS(setIsZoomed)(true);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleDoubleTap = () => {
    if (isZoomed) {
      scale.value = withSpring(1);
      setIsZoomed(false);
    } else {
      scale.value = withSpring(2);
      setIsZoomed(true);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Image 
              source={require('../assets/back.png')}
              style={styles.backButtonIcon}
            />
        </TouchableOpacity>
        
        {onDelete && (
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => onDelete(photo)}
          >
            <Image 
              source={require('../assets/delete.png')}
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.imageContainer}>
        <GestureDetector gesture={pinchGesture}>
          <Animated.View style={[styles.imageWrapper, animatedStyle]}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleDoubleTap}
              style={styles.imageTouchable}
            >
              <Image source={{ uri: photo.uri }} style={styles.image} />
            </TouchableOpacity>
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Text style={styles.photoInfo}>
          {new Date(photo.timestamp).toLocaleDateString()} • {new Date(photo.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  backButtonIcon: {
    width: 40,
    height: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTouchable: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    alignItems: 'center',
  },
  photoInfo: {
    color: 'white',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
});
