import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Gender } from '../types';
import { useAuthStore } from '../store/authStore';
import FormInput from '../components/FormInput';
import RadioGroup from '../components/RadioGroup';
import { validateRegisterForm } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const CITIES = ['Pune', 'Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata'];

export default function RegisterScreen({ navigation }: Props) {
  const register = useAuthStore((s) => s.register);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = () => {
    const formErrors = validateRegisterForm({
      fullName,
      email,
      gender,
      mobile,
      address,
      city,
      password,
      confirmPassword,
    });
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    const result = register({
      id: Date.now().toString(),
      fullName: fullName.trim(),
      email: email.trim(),
      gender: gender as Gender,
      mobile: mobile.trim(),
      address: address.trim(),
      city,
      password,
    });

    if (!result.success) {
      Alert.alert('Registration Failed', result.message);
      return;
    }

    Alert.alert('Success', result.message, [
      { text: 'OK', onPress: () => navigation.navigate('Login') },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Fill in your details to get started</Text>

        <FormInput label="Full Name" placeholder="John Doe" value={fullName} onChangeText={setFullName} error={errors.fullName} />
        <FormInput label="Email Address" placeholder="you@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" error={errors.email} />

        <RadioGroup label="Gender" options={['Male', 'Female', 'Other']} selected={gender} onSelect={setGender} error={errors.gender} />

        <FormInput label="Mobile Number" placeholder="10-digit number" value={mobile} onChangeText={setMobile} keyboardType="number-pad" maxLength={10} error={errors.mobile} />
        <FormInput label="Address" placeholder="Street, area" value={address} onChangeText={setAddress} error={errors.address} />

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>City</Text>
          <View style={[styles.pickerBox, errors.city ? styles.pickerBoxError : null]}>
            <Picker selectedValue={city} onValueChange={setCity}>
              <Picker.Item label="Select a city..." value="" />
              {CITIES.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>
          {!!errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        </View>

        <FormInput label="Password" placeholder="Min. 6 characters" value={password} onChangeText={setPassword} secureTextEntry error={errors.password} />
        <FormInput label="Confirm Password" placeholder="Re-enter password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry error={errors.confirmPassword} />

        <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkWrap}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkBold}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#f9fafb' },
  title: { fontSize: 26, fontWeight: '700', color: '#111827', marginTop: 20, marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  pickerContainer: { marginBottom: 14 },
  pickerLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  pickerBox: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, backgroundColor: '#fff' },
  pickerBoxError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4 },
  button: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkWrap: { marginTop: 20, alignItems: 'center', marginBottom: 20 },
  linkText: { color: '#6b7280', fontSize: 14 },
  linkBold: { color: '#2563eb', fontWeight: '700' },
});
