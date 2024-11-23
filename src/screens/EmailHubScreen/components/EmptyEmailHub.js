import { Text } from '@/components/atoms';
import { useTheme } from '@/theme';
import React from 'react';

const EmptyEmailHub = ({ isFetching, refreshing }) => {
  const { fonts, gutters } = useTheme();
  if (isFetching || refreshing) {
    return null;
  }
  return (
    <Text style={[fonts.size_15, fonts.gray500, fonts.center, gutters.paddingV_40]}>
      No emails found!
    </Text>
  );
};

export default EmptyEmailHub;
