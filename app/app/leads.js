import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

const statusOptions = ['all', 'hot', 'cold', 'warm'];

export default function LeadsScreen() {
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchLeads = async (filterStatus) => {
    setLoading(true);
    try {
      const jwt = await AsyncStorage.getItem('jwt');
      const employeeId = await AsyncStorage.getItem('employeeId');
      let url;
      if (!filterStatus || filterStatus === 'all') {
        url = `https://zi-affiliates-backend.onrender.com/leads/by-employee/${employeeId}`;
      } else {
        url = `https://zi-affiliates-backend.onrender.com/leads?status=${filterStatus}`;
      }
      console.log('Get Leads API call:', { url, jwt, employeeId });
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${jwt}`, 'employee-id': employeeId },
      });
      console.log('Get Leads API result:', res.data);
      setLeads(res.data);
    } catch (err) {
      console.log('Get Leads API error:', err?.response?.data || err.message || err);
      Toast.show({ type: 'error', text1: 'Failed to fetch leads' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(status); }, [status]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leads</Text>
      <View style={styles.statusRow}>
        {statusOptions.map(opt => (
          <Button
            key={opt}
            title={opt}
            color={status === opt ? '#000' : '#ccc'}
            onPress={() => setStatus(opt)}
          />
        ))}
      </View>
      <Button title="Back" onPress={() => router.back()} color="#000" />
      <FlatList
        data={leads}
        keyExtractor={item => item.id || item._id}
        refreshing={loading}
        onRefresh={() => fetchLeads(status)}
        renderItem={({ item }) => (
          <View style={styles.leadItem}>
            <Text style={styles.leadName}>{item.name}</Text>
            <Text style={styles.leadText}>{item.email} | {item.phone}</Text>
            <Text style={styles.leadText}>Status: {item.status}</Text>
            <Text style={styles.leadText}>Date: {item.date}</Text>
            <Text style={styles.leadText}>Notes: {item.notes}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#000' }}>No leads found.</Text>}
      />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#000' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  leadItem: { backgroundColor: '#f2f2f2', borderRadius: 8, padding: 12, marginBottom: 12 },
  leadName: { fontWeight: 'bold', fontSize: 16, color: '#000' },
  leadText: { color: '#000' },
});
