import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FlatList, Picker, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

const statusOptions = ['all', 'hot', 'cold', 'warm'];

export default function LeadsScreen() {
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchLeads = async (filterStatus) => {
    setLoading(true);
    try {
      const jwt = await AsyncStorage.getItem('jwt');
      const employeeId = await AsyncStorage.getItem('employeeId');
      let url = 'https://zi-affiliates-backend.onrender.com/leads';
      if (filterStatus && filterStatus !== 'all') url += `?status=${filterStatus}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${jwt}`, 'employee-id': employeeId },
      });
      setLeads(res.data);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to fetch leads' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(status); }, [status]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leads</Text>
      <Picker selectedValue={status} style={styles.input} onValueChange={setStatus}>
        {statusOptions.map(opt => <Picker.Item key={opt} label={opt} value={opt} />)}
      </Picker>
      <FlatList
        data={leads}
        keyExtractor={item => item.id || item._id}
        refreshing={loading}
        onRefresh={() => fetchLeads(status)}
        renderItem={({ item }) => (
          <View style={styles.leadItem}>
            <Text style={styles.leadName}>{item.name}</Text>
            <Text>{item.email} | {item.phone}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Notes: {item.notes}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No leads found.</Text>}
      />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  leadItem: { backgroundColor: '#f2f2f2', borderRadius: 8, padding: 12, marginBottom: 12 },
  leadName: { fontWeight: 'bold', fontSize: 16 },
});
