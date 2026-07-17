export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const isValidMobile = (mobile: string): boolean => {
  return /^\d{10}$/.test(mobile.trim());
};

export interface RegisterFormValues {
  fullName: string;
  email: string;
  gender: string;
  mobile: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export function validateRegisterForm(values: RegisterFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!values.email.trim()) errors.email = 'Email is required.';
  else if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address.';

  if (!values.gender) errors.gender = 'Please select a gender.';

  if (!values.mobile.trim()) errors.mobile = 'Mobile number is required.';
  else if (!isValidMobile(values.mobile)) errors.mobile = 'Mobile number must be exactly 10 digits.';

  if (!values.address.trim()) errors.address = 'Address is required.';
  if (!values.city) errors.city = 'Please select a city.';

  if (!values.password) errors.password = 'Password is required.';
  else if (values.password.length < 6) errors.password = 'Password must be at least 6 characters.';

  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
  else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match.';

  return errors;
}
