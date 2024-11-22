import { BottomTabStack } from '@/navigators/TabStacks';
import {
  AccountProfileScreen,
  ContactCreateScreen,
  ContactDetailsScreen,
  ContactEditScreen,
  NutCreateScreen,
  NutDetailsScreen,
  PipelineDetailsScreen,
  PipelinesScreen,
  StageDetailsScreen,
} from '@/screens';
import EmailComposeScreen from '@/screens/PipelinesScreen/NutDetailsScreen/EmailComposeScreen';
import EmailDetailsScreen from '@/screens/PipelinesScreen/NutDetailsScreen/EmailDetailsScreen';
import EmailForwardScreen from '@/screens/PipelinesScreen/NutDetailsScreen/EmailForwardScreen';
import EmailReplyScreen from '@/screens/PipelinesScreen/NutDetailsScreen/EmailReplyScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();

export const MainStack = () => {
  return (
    <Stack.Navigator>
      {/*<Stack.Screen name="EditorScreen" component={EditorScreen} options={{ headerShown: false }} />*/}

      <Stack.Screen name="HomeScreen" component={BottomTabStack} options={{ headerShown: false }} />

      <Stack.Screen
        name="ContactDetailsScreen"
        component={ContactDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContactCreateScreen"
        component={ContactCreateScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContactEditScreen"
        component={ContactEditScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PipelinesScreen"
        component={PipelinesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PipelineDetailsScreen"
        component={PipelineDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StageDetailsScreen"
        component={StageDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NutDetailsScreen"
        component={NutDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmailDetailsScreen"
        component={EmailDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmailReplyScreen"
        component={EmailReplyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmailComposeScreen"
        component={EmailComposeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmailForwardScreen"
        component={EmailForwardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NutCreateScreen"
        component={NutCreateScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AccountProfileScreen"
        component={AccountProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
