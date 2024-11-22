import { Text } from '@/components/atoms';
import { AccountScreen, ContactsScreen, DashboardScreen, PipelinesScreen } from '@/screens';
import { useTheme } from '@/theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Icons from 'react-native-heroicons/outline';

const BottomTab = createBottomTabNavigator();

const renderTabLabel = (label, color) => (
  <Text
    style={[
      {
        color: color,
        fontSize: 13,
      },
    ]}
  >
    {label}
  </Text>
);

export const BottomTabStack = () => {
  const { colors, gutters, fonts } = useTheme();

  return (
    <BottomTab.Navigator
      initialRouteName="DashboardScreen"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: [fonts.size_10, gutters.marginT_0],
        tabBarIconStyle: [gutters.marginB_0],
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.gray200,
        },
        tabBarActiveTintColor: colors.green600,
        tabBarInactiveTintColor: colors.gray700,
      }}
    >
      <BottomTab.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{
          tabBarLabel: ({ color }) => renderTabLabel('Dashboard', color),
          tabBarIcon: ({ color }) => <Icons.PresentationChartBarIcon size={20} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="PipelinesScreen"
        component={PipelinesScreen}
        options={{
          tabBarLabel: ({ color }) => renderTabLabel('Pipelines', color),
          tabBarIcon: ({ color }) => <Icons.Squares2X2Icon size={20} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="ContactsScreen"
        component={ContactsScreen}
        options={{
          tabBarLabel: ({ color }) => renderTabLabel('Contacts', color),
          tabBarIcon: ({ color }) => <Icons.UsersIcon size={20} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{
          tabBarLabel: ({ color }) => renderTabLabel('Account', color),
          tabBarIcon: ({ color }) => <Icons.UserCircleIcon size={20} color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
};
