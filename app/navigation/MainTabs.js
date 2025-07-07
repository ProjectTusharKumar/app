import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import FormScreen from '../screens/FormScreen';
import LeadsScreen from '../screens/LeadsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Form" component={FormScreen} />
      <Tab.Screen name="Leads" component={LeadsScreen} />
    </Tab.Navigator>
  );
}
