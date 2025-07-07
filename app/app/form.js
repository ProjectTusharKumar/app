import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

const statusOptions = ['hot', 'cold', 'warm'];

export default function FormScreen() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', status: 'hot', notes: '' });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const jwt = await AsyncStorage.getItem('jwt');
      const employeeId = await AsyncStorage.getItem('employeeId');
      console.log('Create Lead API call:', { ...form, jwt, employeeId });
      const res = await axios.post('https://zi-affiliates-backend.onrender.com/leads', form, {
        headers: { Authorization: `Bearer ${jwt}`, 'employee-id': employeeId, 'Content-Type': 'application/json' },
      });
      console.log('Create Lead API result:', res.data);
      Toast.show({ type: 'success', text1: 'Lead created!' });
      setForm({ name: '', phone: '', email: '', date: '', status: 'hot', notes: '' });
    } catch (err) {
      console.log('Create Lead API error:', err?.response?.data || err.message || err);
      Toast.show({ type: 'error', text1: 'Failed to create lead' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Lead</Text>
      <TextInput style={styles.input} placeholder="Name" value={form.name} onChangeText={v => handleChange('name', v)} placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Phone" value={form.phone} onChangeText={v => handleChange('phone', v)} keyboardType="phone-pad" placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={v => handleChange('email', v)} keyboardType="email-address" placeholderTextColor="#888" />
      <Text style={styles.label}>Date</Text>
      <View style={{ marginBottom: 16 }}>
        <Button
          title={form.date ? `Selected: ${form.date}` : 'Pick a Date'}
          onPress={() => setShowDatePicker(true)}
          color="#000"
        />
        {showDatePicker && (
          <DateTimePicker
            value={form.date ? new Date(form.date) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const yyyy = selectedDate.getFullYear();
                const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const dd = String(selectedDate.getDate()).padStart(2, '0');
                setForm({ ...form, date: `${yyyy}-${mm}-${dd}` });
              }
            }}
          />
        )}
      </View>
      <Text style={styles.label}>Status</Text>
      <View style={styles.statusRow}>
        {statusOptions.map(opt => (
          <Button
            key={opt}
            title={opt}
            color={form.status === opt ? '#000' : '#ccc'}
            onPress={() => handleChange('status', opt)}
          />
        ))}
      </View>
      <TextInput style={styles.input} placeholder="Notes" value={form.notes} onChangeText={v => handleChange('notes', v)} multiline placeholderTextColor="#888" />
      <Button title={loading ? 'Creating...' : 'Create'} onPress={handleSubmit} disabled={loading} color="#000" />
      <Button title="Back" onPress={() => router.back()} color="#000" />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#000' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, color: '#000', backgroundColor: '#fff' },
  label: { color: '#000', marginBottom: 8 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
});
