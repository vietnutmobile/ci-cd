import { Text } from '@/components/atoms';
import {
  MESSAGE_TYPE_ERROR,
  MESSAGE_TYPE_INFO,
  MESSAGE_TYPE_SUCCESS,
  MESSAGE_TYPE_WARNING,
} from '@/helpers/constants';
import { useTheme } from '@/theme';
import { colors } from '@/theme/colors';
import { HStack } from 'native-base';
import React from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from 'react-native-heroicons/outline';

const getColorByType = (type) => {
  switch (type) {
    case MESSAGE_TYPE_SUCCESS:
      return colors.green600;
    case MESSAGE_TYPE_ERROR:
      return colors.red500;
    case MESSAGE_TYPE_WARNING:
      return colors.yellow500;
    case MESSAGE_TYPE_INFO:
    default:
      return colors.sky500;
  }
};

const getIconByType = (type) => {
  switch (type) {
    case MESSAGE_TYPE_SUCCESS:
      return CheckCircleIcon;
    case MESSAGE_TYPE_ERROR:
      return ExclamationCircleIcon;
    case MESSAGE_TYPE_WARNING:
      return ExclamationTriangleIcon;
    case MESSAGE_TYPE_INFO:
    default:
      return InformationCircleIcon;
  }
};

export const MessageVariant = ({ type, message, containerStyle, style }) => {
  const { layout, fonts, borders, gutters } = useTheme();
  const color = getColorByType(type);
  const Icon = getIconByType(type);

  return (
    <HStack
      flex={1}
      p={2}
      space={2}
      style={[borders._1, borders.rounded_4, { borderColor: color }, containerStyle]}
    >
      <Icon style={[gutters.marginT_2]} size={16} color={color} />
      <Text
        style={[
          layout.flex_1,
          fonts.size_14_150,
          fonts.medium,
          {
            color,
          },
          style,
        ]}
      >
        {message}
      </Text>
    </HStack>
  );
};

export default MessageVariant;
