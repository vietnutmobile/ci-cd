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
import EmailHubDetail from '@/screens/EmailHubDetail';
import EmailComposeScreen from '@/screens/PipelinesScreen/NutDetailsScreen/EmailComposeScreen';
import EmailDetailsScreen from '@/screens/PipelinesScreen/NutDetailsScreen/EmailDetailsScreen';
import EmailForwardScreen from '@/screens/PipelinesScreen/NutDetailsScreen/EmailForwardScreen';
import EmailReplyScreen from '@/screens/PipelinesScreen/NutDetailsScreen/EmailReplyScreen';
import PreviewImage from '@/screens/Preview/PreviewImage';
import PreviewPdf from '@/screens/Preview/PreviewPdf';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();

export const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/*<Stack.Screen name="EditorScreen" component={EditorScreen} options={{ headerShown: false }} />*/}
      <Stack.Screen name="HomeScreen" component={BottomTabStack} />
      <Stack.Screen name="ContactDetailsScreen" component={ContactDetailsScreen} />
      <Stack.Screen name="ContactCreateScreen" component={ContactCreateScreen} />
      <Stack.Screen name="ContactEditScreen" component={ContactEditScreen} />
      <Stack.Screen name="PipelinesScreen" component={PipelinesScreen} />
      <Stack.Screen name="PipelineDetailsScreen" component={PipelineDetailsScreen} />
      <Stack.Screen name="StageDetailsScreen" component={StageDetailsScreen} />
      <Stack.Screen name="NutDetailsScreen" component={NutDetailsScreen} />
      <Stack.Screen name="EmailDetailsScreen" component={EmailDetailsScreen} />
      <Stack.Screen name="EmailReplyScreen" component={EmailReplyScreen} />
      <Stack.Screen name="EmailComposeScreen" component={EmailComposeScreen} />
      <Stack.Screen name="EmailForwardScreen" component={EmailForwardScreen} />
      <Stack.Screen name="NutCreateScreen" component={NutCreateScreen} />
      <Stack.Screen name="AccountProfileScreen" component={AccountProfileScreen} />
      <Stack.Screen name="EmailHubDetail" component={EmailHubDetail} />
      <Stack.Screen name="PreviewImage" component={PreviewImage} />
      <Stack.Screen name="PreviewPdf" component={PreviewPdf} />
    </Stack.Navigator>
  );
};
