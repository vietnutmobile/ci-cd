import { Text } from '@/components/atoms';
import SafeScreen from '@/components/modules/SafeScreen';
import HotNuts from '@/components/screens/DashboardScreen/HotNuts';
import { getUserNameFromEmail } from '@/helpers/content';
import { useGetUserProfileQuery } from '@/store/services';
import { useTheme } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { layout, fonts, borders, gutters, backgrounds, dimensions, colors } = useTheme();

  const { data: user } = useGetUserProfileQuery();

  const userName = user?.name ?? getUserNameFromEmail(user?.email ?? '') ?? '';

  return (
    <SafeScreen safeAreaBottom={false} style={[backgrounds.gray100]}>
      <Text style={[gutters.paddingV_12, fonts.size_16, fonts.gray_800]}>
        Welcome
        {userName && (
          <>
            {', '}
            <Text style={[fonts.size_16, fonts.gray_800, fonts.bold]}>
              {user?.name ?? getUserNameFromEmail(user?.email) ?? ''}
            </Text>
          </>
        )}
      </Text>

      <View style={[layout.flex_1, layout.col, layout.itemsCenter, layout.justifyCenter]}>
        <HotNuts />
      </View>
    </SafeScreen>
  );
};

export default DashboardScreen;
