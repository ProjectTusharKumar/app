import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({ total: 0, hot: 0, cold: 0, warm: 0 });

  const fetchStats = async () => {
    try {
      const jwt = await AsyncStorage.getItem('jwt');
      const employeeId = await AsyncStorage.getItem('employeeId');
      const res = await axios.get('https://zi-affiliates-backend.onrender.com/leads/dashboard', {
        headers: { Authorization: `Bearer ${jwt}`, 'employee-id': employeeId },
      });
      setStats(res.data);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to load dashboard' });
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['jwt', 'employeeId']);
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.tiles}>
        <View style={styles.tile}><Text>Total Leads</Text><Text>{stats.total}</Text></View>
        <View style={styles.tile}><Text>Hot</Text><Text>{stats.hot}</Text></View>
        <View style={styles.tile}><Text>Cold</Text><Text>{stats.cold}</Text></View>
        <View style={styles.tile}><Text>Warm</Text><Text>{stats.warm}</Text></View>
      </View>
      <Button title="Logout" onPress={handleLogout} color="#d9534f" />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  tiles: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  tile: { flex: 1, alignItems: 'center', padding: 16, margin: 4, backgroundColor: '#f2f2f2', borderRadius: 8 },
});
