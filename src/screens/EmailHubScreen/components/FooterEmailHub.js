import { Text } from '@/components/atoms';
import { useTheme } from '@/theme';
import { Box } from 'native-base';
import React from 'react';
import { ActivityIndicator } from 'react-native';

const FooterEmailHub = ({ isFetching, refreshing, emails }) => {
  const { fonts, gutters } = useTheme();

  if (isFetching && !refreshing) {
    return (
      <Box py={4} alignItems="center">
        <ActivityIndicator />
      </Box>
    );
  }
  if (!isFetching && emails.length > 4) {
    return (
      <Text style={[fonts.size_15, fonts.gray500, fonts.center, gutters.marginV_12]}>
        End of list.
      </Text>
    );
  }
  return null;
};

export default FooterEmailHub;
