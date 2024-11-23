/* eslint-disable react-native/no-inline-styles */
import { Text } from '@/components/atoms';
import WebViewAuto from '@/components/modules/WebViewAuto';
import { getAvatarName, removeQuotes } from '@/helpers';
import { getUserNameFromEmail } from '@/helpers/content';
import { useTheme } from '@/theme';
import layout from '@/theme/layout';
import { format, formatDistanceToNow } from 'date-fns';
import { Avatar, Box, ChevronDownIcon, ChevronUpIcon, Divider, HStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

const MessageItem = (props) => {
  const { email, show, scrollToItem } = props;
  const { fonts, gutters } = useTheme();
  const [showParticipants, setShowParticipants] = useState(false);
  const [showContent, setShowContent] = useState(show);

  useEffect(() => {
    if (!showContent) setShowParticipants(false);
  }, [showContent]);

  const getName = (user) => {
    return removeQuotes(user.name) || getUserNameFromEmail(user.email);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShowContent((p) => !p)}>
        <HStack space={2} mt={4} alignItems="center">
          <Avatar
            bg="green.500"
            size={10}
            source={{
              uri: email.from.photo,
            }}
          >
            {getAvatarName(getName(email.from))}
          </Avatar>
          <Box flex={1}>
            <HStack space={2} flex={1}>
              <Text
                style={[fonts.size_14, fonts.medium, layout.flex_1]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {getName(email.from)}
                <Text style={[fonts.gray700]}>{` <${email.from.email}> `}</Text>
              </Text>
              <Text
                style={[fonts.size_12, fonts.gray700]}
              >{`${format(email.date, 'h:mm a')}`}</Text>
            </HStack>
            <TouchableOpacity
              style={[layout.row, gutters.paddingT_4, layout.flex_1, gutters.paddingR_8]}
              onPress={() => setShowParticipants(!showParticipants)}
            >
              <Text
                style={[fonts.size_12, fonts.gray600, gutters.marginR_10]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                to {`<${(email.to || []).map((i) => getName(i)).join(', ')}>`}
              </Text>
              {!showParticipants ? <ChevronDownIcon size={4} /> : <ChevronUpIcon size={4} />}
            </TouchableOpacity>
          </Box>
        </HStack>
        {showParticipants && (
          <Box mt={3} borderRadius={8} borderWidth={1} borderColor="gray.200" px={4} py={3}>
            <HStack>
              <Text style={[fonts.size_12, fonts.gray500, { width: 80 }]}>From: </Text>
              <Box>
                <Text style={[fonts.size_12]}>{getName(email.from)}</Text>
                <Text
                  style={[fonts.size_12, fonts.gray500, gutters.marginT_2]}
                >{`${email.from.email}`}</Text>
              </Box>
            </HStack>
            <HStack mt={3}>
              <Text style={[fonts.size_12, fonts.gray500, { width: 80 }]}>To: </Text>
              <Box>
                {email.to.map((item) => (
                  <Box key={item.email} mb={1}>
                    <Text
                      style={[fonts.size_12, fonts.gray500, gutters.marginT_2]}
                    >{`${item.email}`}</Text>
                  </Box>
                ))}
              </Box>
            </HStack>
            <HStack mt={3}>
              <Text style={[fonts.size_12, fonts.gray500, { width: 80 }]}>Date: </Text>
              <Text style={[fonts.size_12]}>
                {format(email.date, 'MMM dd, yyyy, h:mm a')} ({formatDistanceToNow(email.date)} ago)
              </Text>
            </HStack>
            {/* <HStack mt={4}>
              <Text style={[fonts.size_13, fonts.gray500, { width: 80 }]}>Subject: </Text>
              <Text style={[fonts.size_13]}>{email.subject}</Text>
            </HStack> */}
          </Box>
        )}
      </TouchableOpacity>
      {showContent && (
        <WebViewAuto html={email.html} scrollToItem={show ? scrollToItem : undefined} />
      )}
      <Divider mt={4} />
    </>
  );
};

export default MessageItem;
