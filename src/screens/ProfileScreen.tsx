import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../hooks/useTheme';
import FormInput from '../components/FormInput';
import RadioGroup from '../components/RadioGroup';
import { isValidMobile } from '../utils/validation';
import { ThemeColors } from '../theme/colors';

export default function ProfileScreen() {
  const { currentUser, updateProfile, logout } = useAuthStore();
  const { colors, mode, toggleTheme } = useTheme();
  const styles = createStyles(colors);
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState(currentUser?.fullName ?? '');
  const [mobile, setMobile] = useState(currentUser?.mobile ?? '');
  const [gender, setGender] = useState(currentUser?.gender ?? '');
  const [address, setAddress] = useState(currentUser?.address ?? '');
  const [city, setCity] = useState(currentUser?.city ?? '');
  const [error, setError] = useState('');

  if (!currentUser) return null;

  const handleSave = () => {
    if (!fullName.trim() || !mobile.trim() || !address.trim() || !city.trim()) {
      setError('All fields are required.');
      return;
    }
    if (!isValidMobile(mobile)) {
      setError('Mobile number must be exactly 10 digits.');
      return;
    }
    setError('');
    updateProfile({
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      gender: gender as any,
      address: address.trim(),
      city,
    });
    setIsEditing(false);
    Alert.alert('Saved', 'Your profile has been updated.');
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarInitial}>{currentUser.fullName.charAt(0).toUpperCase()}</Text>
      </View>

      <Text style={styles.email}>{currentUser.email}</Text>

      <View style={styles.themeRow}>
        <Text style={styles.themeLabel}>{mode === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}</Text>
        <Switch
          value={mode === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: '#d1d5db', true: colors.primary }}
          thumbColor="#fff"
        />
      </View>

      {isEditing ? (
        <View style={{ marginTop: 20, width: '100%' }}>
          <FormInput label="Full Name" value={fullName} onChangeText={setFullName} />
          <RadioGroup label="Gender" options={['Male', 'Female', 'Other']} selected={gender} onSelect={setGender} />
          <FormInput label="Mobile Number" value={mobile} onChangeText={setMobile} keyboardType="number-pad" maxLength={10} />
          <FormInput label="Address" value={address} onChangeText={setAddress} />
          <FormInput label="City" value={city} onChangeText={setCity} />
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.editRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.infoCard}>
          <InfoRow label="Full Name" value={currentUser.fullName} colors={colors} />
          <InfoRow label="Gender" value={currentUser.gender} colors={colors} />
          <InfoRow label="Mobile" value={currentUser.mobile} colors={colors} />
          <InfoRow label="Address" value={currentUser.address} colors={colors} />
          <InfoRow label="City" value={currentUser.city} colors={colors} />

          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function InfoRow({ label, value, colors }: { label: string; value: string; colors: ThemeColors }) {
  return (
    <View style={[rowStyles.row, { borderBottomColor: colors.divider }]}>
      <Text style={[rowStyles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[rowStyles.value, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
  label: { fontSize: 13, fontWeight: '600' },
  value: { fontSize: 14, maxWidth: '60%', textAlign: 'right' },
});

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flexGrow: 1, padding: 24, alignItems: 'center' },
    avatarCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    avatarInitial: { color: '#fff', fontSize: 32, fontWeight: '700' },
    email: { fontSize: 14, color: colors.textSecondary, marginTop: 10 },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginTop: 18,
      borderWidth: 1,
      borderColor: colors.border,
    },
    themeLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
    infoCard: { width: '100%', marginTop: 10 },
    editButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 24,
    },
    editButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
    logoutButton: {
      borderWidth: 1,
      borderColor: colors.danger,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 12,
    },
    logoutButtonText: { color: colors.danger, fontSize: 15, fontWeight: '600' },
    editRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
    button: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
    cancelButton: { borderWidth: 1, borderColor: colors.border },
    cancelButtonText: { color: colors.text, fontWeight: '600' },
    saveButton: { backgroundColor: colors.primary },
    saveButtonText: { color: '#fff', fontWeight: '600' },
    errorText: { color: colors.danger, fontSize: 12, marginBottom: 8 },
  });
