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
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { RootStackParamList } from '../types';
import { useTheme } from '../hooks/useTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'ImageDetails'>;

const { width } = Dimensions.get('window');

export default function ImageDetailsScreen({ route }: Props) {
  const { image } = route.params;
  const { colors } = useTheme();
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

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
      console.error('Download error:', err);
      Alert.alert('Download Failed', String(err));
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      setSharing(true);

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Not Available', 'Sharing is not available on this device.');
        setSharing(false);
        return;
      }

      // Download to a temp local file first, since expo-sharing needs a local URI
      const fileUri = FileSystem.cacheDirectory + `picsum-share-${image.id}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(fullUrl, fileUri);

      await Sharing.shareAsync(downloadResult.uri, {
        dialogTitle: `Share photo by ${image.author}`,
        mimeType: 'image/jpeg',
      });
    } catch (err) {
      console.error('Share error:', err);
      Alert.alert('Share Failed', String(err));
    } finally {
      setSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: fullUrl }} style={styles.image} resizeMode="cover" />

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.author, { color: colors.text }]}>{image.author}</Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>Image ID: {image.id}</Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>Dimensions: {image.width} × {image.height}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleDownload}
            disabled={downloading || sharing}
          >
            {downloading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>Download</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton, { borderColor: colors.primary }]}
            onPress={handleShare}
            disabled={downloading || sharing}
          >
            {sharing ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>Share</Text>
            )}
          </TouchableOpacity>
        </View>
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
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  actionButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});