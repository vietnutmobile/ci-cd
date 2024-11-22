import { Text } from '@/components/atoms';
import { useTheme } from '@/theme';
import React from 'react';

const RequiredLabel = () => {
  const { fonts, gutters } = useTheme();
  return <Text style={[fonts.size_14_150, fonts.medium, fonts.red600]}>*</Text>;
};

export default RequiredLabel;
