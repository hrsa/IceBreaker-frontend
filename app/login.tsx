import React, { useState } from 'react';
import {
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
import {Redirect, useRouter} from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/src/stores/authStore';
import {useLoginStyles} from "@/src/styles/Login";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get common styles
  const styles = useLoginStyles();

  // Get placeholder color for inputs
  const placeholderColor = useThemeColor({}, 'placeholder');

  // Get auth store functions
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  if (user) {
    return <Redirect href={'/'}/>;
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      router.replace('/');
    } catch (error) {
      console.error('Login error:', error);
      // Error is already set in the store
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToRegister = () => {
    clearError();
    router.push('/register');
  };

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
              <Text style={styles.title}>Welcome to IceBreaker</Text>
              <Text style={styles.subtitle}>
                Sign in to continue to your account
              </Text>
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
                placeholder="Enter your password"
                placeholderTextColor={placeholderColor}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={isLoading || isSubmitting}
              >
                {(isLoading || isSubmitting) ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
