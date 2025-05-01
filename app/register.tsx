import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/src/stores/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get colors from theme
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const placeholderColor = useThemeColor({}, 'placeholder');
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');
  const borderColor = useThemeColor({}, 'border');

  // Get auth store functions
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleRegister = async () => {
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(email, password, name);
      router.replace('/');
    } catch (error) {
      console.error('Registration error:', error);
      // Error is already set in the store
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToLogin = () => {
    clearError();
    router.push('/login');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    scrollView: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    header: {
      marginBottom: 40,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: textColor,
      opacity: 0.7,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: textColor,
    },
    input: {
      backgroundColor: inputBackgroundColor,
      borderRadius: 8,
      padding: 15,
      fontSize: 16,
      color: textColor,
      borderWidth: 1,
      borderColor: borderColor,
    },
    buttonContainer: {
      marginTop: 10,
    },
    button: {
      backgroundColor: primaryColor,
      borderRadius: 8,
      padding: 15,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    loginContainer: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    loginText: {
      color: textColor,
      fontSize: 14,
    },
    loginLink: {
      color: primaryColor,
      fontSize: 14,
      fontWeight: 'bold',
      marginLeft: 5,
    },
    errorText: {
      color: 'red',
      marginTop: 20,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Sign up to start using IceBreaker
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={placeholderColor}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={placeholderColor}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor={placeholderColor}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={placeholderColor}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={isLoading || isSubmitting}
              >
                {(isLoading || isSubmitting) ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}