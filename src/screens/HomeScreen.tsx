import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList, PicsumImage, FilterOption } from '../types';
import { useImageGallery } from '../hooks/useImageGallery';
import { useDebounce } from '../hooks/useDebounce';
import { useFavoritesStore } from '../store/favoritesStore';
import { useTheme } from '../hooks/useTheme';
import ImageCard from '../components/ImageCard';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const FILTERS: { label: string; value: FilterOption }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Author A-M', value: 'A_M' },
  { label: 'Author N-Z', value: 'N_Z' },
];

export default function HomeScreen({ navigation }: Props) {
  const { images, loading, refreshing, error, loadInitial, loadMore, refresh, retry } = useImageGallery();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 400);
  const [filter, setFilter] = useState<FilterOption>('ALL');

  useEffect(() => {
    loadInitial();
  }, []);

  const filteredImages = useMemo(() => {
    let result = images;

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.trim().toLowerCase();
      result = result.filter((img) => img.author.toLowerCase().includes(q));
    }

    if (filter === 'A_M') {
      result = result.filter((img) => /^[a-m]/i.test(img.author.trim()));
    } else if (filter === 'N_Z') {
      result = result.filter((img) => /^[n-z]/i.test(img.author.trim()));
    }

    return result;
  }, [images, debouncedQuery, filter]);

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
        placeholder="Search by author name..."
        placeholderTextColor={colors.placeholder}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
      />

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[
              styles.filterChip,
              { backgroundColor: colors.chipBg },
              filter === f.value && { backgroundColor: colors.primary },
            ]}
            onPress={() => setFilter(f.value)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: colors.text },
                filter === f.value && styles.filterChipTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
          <TouchableOpacity onPress={images.length === 0 ? loadInitial : retry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && images.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={filteredImages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          onEndReached={() => {
            // Only paginate when not actively searching/filtering, matching raw API pages
            if (!debouncedQuery.trim() && filter === 'ALL') loadMore();
          }}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No images found.</Text>
            </View>
          }
          ListFooterComponent={
            loading && images.length > 0 ? (
              <ActivityIndicator style={{ marginVertical: 16 }} color="#2563eb" />
            ) : null
          }
        />
      )}
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
  filterRow: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 8, gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: '#2563eb' },
  filterChipText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  filterChipTextActive: { color: '#fff' },
  listContent: { paddingHorizontal: 6, paddingBottom: 20 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { color: '#6b7280', fontSize: 14 },
  errorBanner: {
    backgroundColor: '#fee2e2',
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorBannerText: { color: '#b91c1c', fontSize: 12, flex: 1 },
  retryText: { color: '#b91c1c', fontWeight: '700', fontSize: 12 },
});