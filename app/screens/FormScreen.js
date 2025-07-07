import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState } from 'react';
import { Button, Picker, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

const statusOptions = ['hot', 'cold', 'warm'];

export default function FormScreen() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', status: 'hot', notes: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const jwt = await AsyncStorage.getItem('jwt');
      const employeeId = await AsyncStorage.getItem('employeeId');
      await axios.post('https://zi-affiliates-backend.onrender.com/leads', form, {
        headers: { Authorization: `Bearer ${jwt}`, 'employee-id': employeeId, 'Content-Type': 'application/json' },
      });
      Toast.show({ type: 'success', text1: 'Lead created!' });
      setForm({ name: '', phone: '', email: '', date: '', status: 'hot', notes: '' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to create lead' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Lead</Text>
      <TextInput style={styles.input} placeholder="Name" value={form.name} onChangeText={v => handleChange('name', v)} />
      <TextInput style={styles.input} placeholder="Phone" value={form.phone} onChangeText={v => handleChange('phone', v)} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={v => handleChange('email', v)} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={form.date} onChangeText={v => handleChange('date', v)} />
      <Picker selectedValue={form.status} style={styles.input} onValueChange={v => handleChange('status', v)}>
        {statusOptions.map(opt => <Picker.Item key={opt} label={opt} value={opt} />)}
      </Picker>
      <TextInput style={styles.input} placeholder="Notes" value={form.notes} onChangeText={v => handleChange('notes', v)} multiline />
      <Button title={loading ? 'Creating...' : 'Create'} onPress={handleSubmit} disabled={loading} />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
});
