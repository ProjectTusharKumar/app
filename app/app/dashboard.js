import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function DashboardScreen() {
  const [stats, setStats] = useState({ totalLeads: 0, hotCount: 0, coldCount: 0, warmCount: 0 });
  const router = useRouter();

  const fetchStats = async () => {
    try {
      const jwt = await AsyncStorage.getItem('jwt');
      const employeeId = await AsyncStorage.getItem('employeeId');
      console.log('Dashboard API call:', { jwt, employeeId });
      const res = await axios.get('https://zi-affiliates-backend.onrender.com/leads/dashboard', {
        headers: { Authorization: `Bearer ${jwt}`, 'employee-id': employeeId },
      });
      console.log('Dashboard API result:', res.data);
      setStats(res.data);
    } catch (err) {
      console.log('Dashboard API error:', err?.response?.data || err.message || err);
      Toast.show({ type: 'error', text1: 'Failed to load dashboard' });
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['jwt', 'employeeId']);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.tiles}>
        <View style={styles.tile}><Text style={styles.tileText}>Total Leads</Text><Text style={styles.tileText}>{stats.totalLeads}</Text></View>
        <View style={styles.tile}><Text style={styles.tileText}>Hot</Text><Text style={styles.tileText}>{stats.hotCount}</Text></View>
        <View style={styles.tile}><Text style={styles.tileText}>Cold</Text><Text style={styles.tileText}>{stats.coldCount}</Text></View>
        <View style={styles.tile}><Text style={styles.tileText}>Warm</Text><Text style={styles.tileText}>{stats.warmCount}</Text></View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button title="Form" onPress={() => router.push('/form')} color="#000" />
        <Button title="Leads" onPress={() => router.push('/leads')} color="#000" />
      </View>
      <Button title="Logout" onPress={handleLogout} color="#000" />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#000' },
  tiles: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  tile: { flex: 1, alignItems: 'center', padding: 16, margin: 4, backgroundColor: '#f2f2f2', borderRadius: 8 },
  tileText: { color: '#000', fontWeight: 'bold' },
});
