import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { RootStackParamList } from '../types';
import { useTheme } from '../hooks/useTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'ImageDetails'>;

const { width } = Dimensions.get('window');

export default function ImageDetailsScreen({ route }: Props) {
  const { image } = route.params;
  const { colors } = useTheme();
  const [downloading, setDownloading] = useState(false);

  const fullUrl = `https://picsum.photos/id/${image.id}/${Math.min(image.width, 1080)}/${Math.min(
    image.height,
    1080
  )}`;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to save images.');
        setDownloading(false);
        return;
      }

      const fileUri = FileSystem.cacheDirectory + `picsum-${image.id}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(fullUrl, fileUri);

      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync('FotoOwl Assignment', asset, false);

      Alert.alert('Downloaded', 'Image saved to your gallery.');
    } catch (err) {
      Alert.alert('Download Failed', 'Something went wrong while saving the image.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: fullUrl }} style={styles.image} resizeMode="cover" />

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.author, { color: colors.text }]}>{image.author}</Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>Image ID: {image.id}</Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>Dimensions: {image.width} × {image.height}</Text>

        <TouchableOpacity style={[styles.downloadButton, { backgroundColor: colors.primary }]} onPress={handleDownload} disabled={downloading}>
          {downloading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.downloadButtonText}>Download to Gallery</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  image: { width, height: width, backgroundColor: '#111' },
  infoCard: { padding: 20, backgroundColor: '#fff', flex: 1 },
  author: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 6 },
  meta: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  downloadButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  downloadButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
