import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList, PicsumImage } from '../types';
import { useFavoritesStore } from '../store/favoritesStore';
import { useTheme } from '../hooks/useTheme';
import ImageCard from '../components/ImageCard';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Favorites'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function FavoritesScreen({ navigation }: Props) {
  const { favorites, toggleFavorite, isFavorite } = useFavoritesStore();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return favorites;
    const q = searchQuery.trim().toLowerCase();
    return favorites.filter((img) => img.author.toLowerCase().includes(q));
  }, [favorites, searchQuery]);

  const renderItem = ({ item }: { item: PicsumImage }) => (
    <ImageCard
      image={item}
      isFavorite={isFavorite(item.id)}
      onPress={() => navigation.navigate('ImageDetails', { image: item })}
      onToggleFavorite={() => toggleFavorite(item)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[styles.searchInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
        placeholder="Search favorites by author..."
        placeholderTextColor={colors.placeholder}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No favorites yet. Tap the heart icon on any image to save it here.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  searchInput: {
    margin: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  listContent: { paddingHorizontal: 6, paddingBottom: 20 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 30 },
  emptyText: { color: '#6b7280', fontSize: 14, textAlign: 'center' },
});
