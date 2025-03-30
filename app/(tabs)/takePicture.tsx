import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  SafeAreaView 
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';


export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.grantButton} onPress={requestPermission}>
          <Text style={styles.grantText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {
    if (!cameraRef.current) {
      console.error("Camera is not ready yet!");
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync();
      const cacheUri = `${FileSystem.cacheDirectory}photo_${Date.now()}.jpg`;
      await FileSystem.moveAsync({ from: photo.uri, to: cacheUri });
      setPhotoUris(prev => [...prev, cacheUri]);
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  const deletePhoto = (index) => {
    setPhotoUris(photoUris.filter((_, i) => i !== index));
  };

  const preparePhotosForUpload = () => {
    console.log("Photos ready for API upload:", photoUris);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.captureButton]} onPress={takePicture}>
              <Text style={styles.text}>Capture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      {/* Gallery Section */}
      <View style={styles.galleryContainer}>
        <Text style={styles.galleryTitle}>Captured Photos ({photoUris.length}/4)</Text>
        <ScrollView horizontal style={styles.photoScroll}>
          {photoUris.map((uri, i) => (
            <View key={`photo-${i}`} style={styles.thumbnailContainer}>
              <Image source={{ uri }} style={styles.thumbnail} />
              <TouchableOpacity style={styles.deleteButton} onPress={() => deletePhoto(i)}>
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
          {[...Array(Math.max(0, 4 - photoUris.length))].map((_, i) => (
            <View key={`placeholder-${i}`} style={[styles.thumbnailContainer, styles.placeholderThumbnail]}>
              <Text style={styles.placeholderText}>+</Text>
            </View>
          ))}
        </ScrollView>

        {/* Upload Button (Placed Outside ScrollView) */}
        {photoUris.length > 0 && (
          <TouchableOpacity 
            style={styles.uploadButton} 
            //onPress={preparePhotosForUpload}
            onPress={() => router.push('/ObjectConfirmationScreen')}
          >
            <Text style={styles.uploadButtonText}>
              {photoUris.length >= 4 ? "Upload 4 Photos" : "Upload Photos"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    width: '100%',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    backgroundColor: '#d9534f',
  },
  text: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  message: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  grantButton: {
    backgroundColor: '#5A5858',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    alignSelf: 'center',
  },
  grantText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  galleryContainer: {
    height: 190, // Increased height for the upload button
    backgroundColor: '#2c2c2c',
    padding: 10,
    alignItems: 'center', // Ensure upload button is centered
  },
  galleryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  photoScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  thumbnailContainer: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,0,0,0.8)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  placeholderThumbnail: {
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    color: '#999',
  },
  uploadButton: {
    backgroundColor: '#4630EB',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    width: '90%',
    marginTop: 10, // Ensure it has spacing
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
