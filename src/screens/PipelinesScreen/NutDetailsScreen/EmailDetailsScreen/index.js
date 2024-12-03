import { Button, Text } from '@/components/atoms';
import SafeScreen from '@/components/modules/SafeScreen';
import WebViewAuto from '@/components/modules/WebViewAuto';
import NutDetailsScreenNavbar from '@/components/screens/NutDetailsScreen/Navbar';
import { formatEmailDate, htmlToPlainText, processEmailSender } from '@/helpers';
import { MODE_FORWARD, MODE_REPLY_ALL, MODE_REPLY_SINGLE } from '@/helpers/constants';
import { downloadFile } from '@/helpers/file-system';
import useNavigator from '@/helpers/hooks/use-navigation';
import { startEmailForward, startEmailReply } from '@/store/features/email-composer';

import { useTheme } from '@/theme';
import { Images } from '@/theme/ImageProvider';
import { useRoute } from '@react-navigation/native';
import { Box, FlatList, HStack, ScrollView, VStack } from 'native-base';

import React, { useCallback, useState } from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';
import { useDispatch } from 'react-redux';
import truncate from 'truncate-html';

function EmailDetailsScreen() {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigator();

  const { layout, gutters, fonts, colors, borders, backgrounds, dimensions, effects } = useTheme();

  const [shouldShowDeliveryDetails, setShouldShowDeliveryDetails] = useState(false);
  const rotation = useState(new Animated.Value(0))[0];

  const { width } = useWindowDimensions();

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const { email, nutId } = route?.params;

  const date = formatEmailDate(email?.date ?? new Date());

  const messageBodyText = truncate(htmlToPlainText(email?.messageBodyHtml ?? ''), {
    length: 80,
    stripTags: true,
  });

  const attachments = email?.emailAttachmentFile ?? [];

  const shouldAllowReply = email?.emailCategory === 'incoming';

  const renderFile = useCallback(({ item, index }) => {
    return (
      <Button
        type="native"
        style={[
          layout.row,
          layout.justifyBetween,
          layout.itemsCenter,
          gutters.paddingV_10,
          gutters.paddingH_12,
          borders._1,
          borders.rounded_6,
          borders.gray300,
          ...(index > 0 ? [gutters.marginT_8] : []),
        ]}
        onPress={async () =>
          downloadFile({
            name: item.fileName,
            url: item.s3BucketUrl,
          })
        }
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[layout.flex_1, gutters.marginR_6, fonts.size_14, fonts.gray800]}
        >
          {item.fileName} ({Math.round(item.size / 1024)}K)
        </Text>
        <Button type="native">
          <Icons.CloudArrowDownIcon size={20} color={colors.green600} />
        </Button>
      </Button>
    );
  }, []);

  const { name: senderName } = processEmailSender(email?.sender);

  const toggleDeliveryDetails = () => {
    if (shouldShowDeliveryDetails) {
      Animated.timing(rotation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(rotation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    setShouldShowDeliveryDetails(!shouldShowDeliveryDetails);
  };

  return (
    <SafeScreen style={[backgrounds.gray100]}>
      <NutDetailsScreenNavbar />

      <ScrollView style={[backgrounds.white, gutters.padding_12, borders.rounded_8]}>
        <Button
          style={[borders.bottom_1, borders.gray200]}
          type="native"
          onPress={toggleDeliveryDetails}
        >
          <HStack pb={3} space={2.5}>
            <View
              style={[
                dimensions.width_38,
                dimensions.height_38,
                layout.itemsCenter,
                layout.justifyCenter,
                borders.roundedFull,
                backgrounds.gray200,
              ]}
            >
              <Icons.UserCircleIcon size={20} color={colors.gray900} />
            </View>

            <View style={[layout.flex_1]}>
              <HStack justifyContent="space-between" space={2} mb={2}>
                <Text style={[layout.row, layout.flex_1, layout.itemsCenter]}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[layout.flex_1, fonts.size_14_150, fonts.medium, fonts.gray900]}
                  >
                    {senderName.trim()}
                  </Text>
                  <Animated.View style={[animatedStyle]}>
                    <Icons.ChevronDownIcon
                      style={[gutters.marginL_6]}
                      size={14}
                      color={colors.gray900}
                    />
                  </Animated.View>
                </Text>
                <Text style={[fonts.size_13, fonts.blue600]}>{date}</Text>
              </HStack>

              <VStack space={1}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[fonts.size_14_150, fonts.gray800]}
                >
                  {messageBodyText}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[fonts.size_14_150, fonts.gray800]}
                >
                  To: {email?.recipient ?? ''}
                </Text>
              </VStack>
            </View>
          </HStack>
        </Button>

        {shouldShowDeliveryDetails && (
          <View style={[gutters.paddingV_10, borders.bottom_1, borders.gray200]}>
            {
              <HStack pb={2} space={2.5}>
                <View style={[dimensions.width_38]}>
                  <Text style={[fonts.size_13_150, fonts.gray800]}>From</Text>
                </View>
                <View style={[layout.flex_1]}>
                  <Text style={[fonts.size_13_150, fonts.gray800]}>{email?.sender}</Text>
                </View>
              </HStack>
            }
            {
              <HStack pb={2} space={2.5}>
                <View style={[dimensions.width_38]}>
                  <Text style={[fonts.size_13_150, fonts.gray800]}>To</Text>
                </View>

                <View style={[layout.flex_1]}>
                  <Text style={[fonts.size_13_150, fonts.gray800]}>{email?.recipient ?? ''}</Text>
                </View>
              </HStack>
            }
            {
              <HStack space={2.5}>
                <View style={[dimensions.width_38]}>
                  <Text style={[fonts.size_13_150, fonts.gray800]}>Cc</Text>
                </View>

                <View style={[layout.flex_1]}>
                  <Text style={[fonts.size_13_150, fonts.gray800]}>
                    {email.ccEmails.join(', ')}
                  </Text>
                </View>
              </HStack>
            }
          </View>
        )}

        {attachments?.length > 0 && (
          <View style={[gutters.paddingV_10, borders.bottom_1, borders.gray200]}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[gutters.marginB_8, fonts.size_14_150, fonts.semi, fonts.gray800]}
            >
              Attachments:
            </Text>
            <FlatList data={attachments} renderItem={renderFile} />
          </View>
        )}
        {email.messageBodyHtml ? (
          <WebViewAuto html={email.messageBodyHtml} widthContent={width - 48} />
        ) : null}
        <Box h={10} />
      </ScrollView>

      {shouldAllowReply ? (
        <>
          <View style={[dimensions.height_72]} />
          <View
            style={[
              layout.absolute,
              layout.bottom0,
              layout.left0,
              layout.right0,
              layout.row,
              layout.justifyBetween,
              layout.itemsCenter,
              gutters.padding_8,
              backgrounds.white,
            ]}
          >
            <HStack>
              <Button
                type="native"
                style={[layout.row, layout.itemsCenter, gutters.padding_10]}
                onPress={() => {
                  dispatch(
                    startEmailReply({
                      email,
                      nutId,
                      mode: MODE_REPLY_SINGLE,
                    }),
                  );
                  navigation.navigate('EmailReplyScreen');
                }}
                testID="button_Reply"
              >
                <Images.IC_REPLY color={colors.green600} width={20} height={20} />
                <Text
                  style={[
                    gutters.marginL_10,
                    fonts.size_14_150,
                    fonts.semi,
                    fonts.gray700,
                    fonts.green600,
                  ]}
                >
                  Reply
                </Text>
              </Button>

              <Button
                type="native"
                style={[layout.row, layout.itemsCenter, gutters.padding_10]}
                onPress={() => {
                  dispatch(
                    startEmailReply({
                      email,
                      nutId,
                      mode: MODE_REPLY_ALL,
                    }),
                  );
                  navigation.navigate('EmailReplyScreen');
                }}
                testID="button_Reply All"
              >
                <Images.IC_REPLY_ALL color={colors.green600} width={20} height={20} />
                <Text
                  style={[
                    gutters.marginL_10,
                    fonts.size_14_150,
                    fonts.semi,
                    fonts.gray700,
                    fonts.green600,
                  ]}
                >
                  Reply All
                </Text>
              </Button>
            </HStack>

            <Button
              type="native"
              style={[layout.row, layout.itemsCenter, gutters.padding_8]}
              onPress={() => {
                dispatch(
                  startEmailForward({
                    email,
                    nutId: route.params?.nutId,
                    mode: MODE_FORWARD,
                  }),
                );
                navigation.navigate('EmailForwardScreen');
              }}
              testID="button_Forward"
            >
              <Text
                style={[
                  gutters.marginR_4,
                  fonts.size_14_150,
                  fonts.semi,
                  fonts.gray700,
                  fonts.blue600,
                ]}
              >
                Forward
              </Text>
              <Images.IC_FORWARD color={colors.blue600} width={20} height={20} />
            </Button>
          </View>
        </>
      ) : (
        <View style={[dimensions.height_20]} />
      )}
    </SafeScreen>
  );
}

export default EmailDetailsScreen;
