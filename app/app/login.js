import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post('https://zi-affiliates-backend.onrender.com/user/login', {
        email,
        password,
      });
      console.log('Login response:', res.data);
      // Fix: Use empId from response
      const { token, empId } = res.data;
      await AsyncStorage.setItem('jwt', token);
      await AsyncStorage.setItem('employeeId', empId);
      Toast.show({ type: 'success', text1: 'Login successful!' });
      router.replace('/dashboard');
    } catch (err) {
      console.log('Login error:', err?.response?.data || err.message || err);
      Toast.show({ type: 'error', text1: 'Login failed', text2: err?.response?.data?.message || 'Check credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#888" />
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} color="#000" />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#000' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, color: '#000', backgroundColor: '#fff' },
});
