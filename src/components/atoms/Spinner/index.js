import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/theme';

const Spinner = ({ size, color }) => {
  const { layout, colors } = useTheme();
  return (
    <View style={[layout.flex_1, layout.justifyCenter, layout.itemsCenter]}>
      <ActivityIndicator size={size || 'large'} color={colors.green600} />
    </View>
  );
};

export default Spinner;
