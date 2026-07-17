import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RadioGroupProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  error?: string;
}

export default function RadioGroup({ label, options, selected, onSelect, error }: RadioGroupProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const isSelected = selected === option;
          return (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              onPress={() => onSelect(option)}
              activeOpacity={0.7}
            >
              <View style={[styles.circle, isSelected && styles.circleSelected]}>
                {isSelected && <View style={styles.innerDot} />}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 20 },
  optionRow: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9ca3af',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  circleSelected: { borderColor: '#2563eb' },
  innerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2563eb' },
  optionText: { fontSize: 14, color: '#111827' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4 },
});
