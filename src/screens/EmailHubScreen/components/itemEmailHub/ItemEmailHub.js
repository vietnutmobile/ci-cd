import { Text } from '@/components/atoms';
import { capitalizeFirstLetter, removeQuotes } from '@/helpers';
import { useTheme } from '@/theme';
import { Images } from '@/theme/ImageProvider';
import { format, isToday } from 'date-fns';
import { Box, Button, HStack } from 'native-base';
import React, { useRef } from 'react';
import { ArrowPathRoundedSquareIcon, ShieldCheckIcon } from 'react-native-heroicons/outline';
import ModalConvert from './ModalConvert';
import ModalReport from './ModalReport';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';
import { TYPE_EMAIL_HUB } from '../../index';
import { EMAIL_LABEL_INBOX, EMAIL_LABEL_SENT, EMAIL_LABEL_SENT_ITEMS } from '@/helpers/constants';

const ItemEmailHub = ({ item, selectEmailType, selectMailboxUser }) => {
  const navigation = useNavigation();
  const modalConvertRef = useRef(null);
  const modalReportRef = useRef(null);
  const { fonts, gutters, colors } = useTheme();

  const message = item.messages[0];

  const labels = (message?.labels ?? [])
    .filter(Boolean)
    .map((label) => label.toLowerCase().replaceAll(/_/g, ' ').replaceAll('category', '').trim())
    .filter((label) => label !== 'unread');
  const isSenderAndRecipientSame =
    (labels.includes(EMAIL_LABEL_SENT) || labels.includes(EMAIL_LABEL_SENT_ITEMS)) &&
    labels.includes(EMAIL_LABEL_INBOX);

  const renderButton = () => {
    if (isSenderAndRecipientSame) {
      return null;
    }
    if (selectEmailType === TYPE_EMAIL_HUB.SPAM) {
      return (
        <Button
          endIcon={<ShieldCheckIcon size={16} color={colors.green600} />}
          variant="outline"
          size="sm"
          py={1.5}
          flex={1}
          justifyContent="flex-end"
          borderColor={colors.white}
          onPress={() => modalReportRef.current.showModalReport()}
        >
          <Text style={[fonts.size_12, fonts.green600, fonts.medium]}>Report Not Spam</Text>
        </Button>
      );
    }
    if (item.hasNut) {
      return (
        <HStack
          py={1.5}
          px={2}
          flex={1}
          justifyContent="flex-end"
          alignSelf="center"
          space={1}
          alignItems="center"
        >
          <Text style={[fonts.size_12, fonts.green600, fonts.medium]}>Email is Nut</Text>
          <Images.IC_NUT width={16} height={16} color={colors.green600} fill={colors.green600} />
        </HStack>
      );
    }
    return (
      <Button
        endIcon={<ArrowPathRoundedSquareIcon size={16} color={colors.green600} />}
        variant="ghost"
        size="sm"
        py={1.5}
        flex={1}
        justifyContent="flex-end"
        borderColor={colors.white}
        onPress={() => modalConvertRef.current.showModalConvert()}
      >
        <Text style={[fonts.size_12, fonts.green600, fonts.medium]}>Convert to Nut</Text>
      </Button>
    );
  };

  const renderTitle = () => {
    const isSentEmail = selectEmailType === TYPE_EMAIL_HUB.SENT;
    const nameDisplay = isSentEmail
      ? `To: ${message.to.map((to) => removeQuotes(to.name)).join(', ')}`
      : removeQuotes(message.from.name);

    return (
      <HStack space={2} alignItems="center">
        <Text style={[fonts.size_16, fonts.medium]} numberOfLines={1} flex={1}>
          {nameDisplay} {item.messages.length > 1 ? `(${item.messages.length})` : ''}
        </Text>
        <Text style={[fonts.size_14, fonts.gray600]}>
          {isToday(message.date) ? format(message.date, 'hh:mm a') : format(message.date, 'MMM d')}
        </Text>
      </HStack>
    );
  };

  const isLongLabel = message.labels.length > 3;

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('EmailHubDetail', {
          threadId: item.id,
          user: selectMailboxUser,
          selectEmailType,
        })
      }
    >
      <Box px={3} py={3.5} bg="white" mt={2} rounded={4}>
        {renderTitle()}
        <Text style={[fonts.size_14, fonts.medium, gutters.paddingT_6]} numberOfLines={1}>
          {removeQuotes(message.subject)}
        </Text>
        <Text style={[fonts.size_14, fonts.gray500, gutters.paddingT_4]} numberOfLines={1} mt={1}>
          {message.snippet}
        </Text>
        <HStack mt={2.5} space={2} flexWrap="wrap">
          {message.labels.map((label) => (
            <Box
              alignItems="center"
              justifyContent="center"
              key={label}
              bg="gray.100"
              px={2}
              py={1}
              borderRadius={4}
            >
              <Text style={[fonts.size_12, fonts.gray700, fonts.medium]}>
                {capitalizeFirstLetter(label.replace('CATEGORY_', ''))}
              </Text>
            </Box>
          ))}
          {!isLongLabel && renderButton()}
        </HStack>
        {isLongLabel && (
          <HStack mt={2}>
            <Box flex={1.5} />
            {renderButton()}
          </HStack>
        )}
        <ModalConvert item={item} ref={modalConvertRef} selectMailboxUser={selectMailboxUser} />
        <ModalReport item={item} ref={modalReportRef} selectMailboxUser={selectMailboxUser} />
      </Box>
    </Pressable>
  );
};

export default ItemEmailHub;
