import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PicsumImage } from '../types';
import { useTheme } from '../hooks/useTheme';

interface ImageCardProps {
  image: PicsumImage;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export default function ImageCard({ image, isFavorite, onPress, onToggleFavorite }: ImageCardProps) {
  const { colors } = useTheme();
  const thumbUrl = `https://picsum.photos/id/${image.id}/300/300`;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={{ uri: thumbUrl }} style={styles.thumbnail} />
      <View style={styles.infoRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.author, { color: colors.text }]} numberOfLines={1}>{image.author}</Text>
          <Text style={[styles.idText, { color: colors.textSecondary }]}>ID: {image.id}</Text>
        </View>
        <TouchableOpacity
          onPress={onToggleFavorite}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.heartButton}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? '#ef4444' : colors.placeholder}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  thumbnail: { width: '100%', height: 140, backgroundColor: '#e5e7eb' },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  author: { fontSize: 13, fontWeight: '600', color: '#111827' },
  idText: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  heartButton: { marginLeft: 6, padding: 2 },
});
