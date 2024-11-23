import { Text } from '@/components/atoms';
import NavbarWrapper from '@/components/modules/NavbarWrapper';
import { capitalizeFirstLetter, removeQuotes } from '@/helpers';
import { useGetEmailhubDetailQuery } from '@/store/services';
import { useTheme } from '@/theme';
import { Images } from '@/theme/ImageProvider';
import { useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { Box, Button, HStack, Spinner } from 'native-base';
import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { ArrowPathRoundedSquareIcon, ShieldCheckIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TYPE_EMAIL_HUB } from '../EmailHubScreen';
import ModalConvert from '../EmailHubScreen/components/itemEmailHub/ModalConvert';
import ModalReport from '../EmailHubScreen/components/itemEmailHub/ModalReport';
import MessageItem from './components/MessageItem';
import { EMAIL_LABEL_INBOX, EMAIL_LABEL_SENT, EMAIL_LABEL_SENT_ITEMS } from '@/helpers/constants';

const EmailHubDetail = () => {
  const { fonts, colors } = useTheme();
  const { params } = useRoute();
  const { threadId, user, selectEmailType } = params;
  const modalConvertRef = useRef(null);
  const modalReportRef = useRef(null);
  const flashListRef = useRef(null);
  const { data, isLoading, isFetching, refetch } = useGetEmailhubDetailQuery(
    { userId: user?.id, threadId },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const scrollToItem = () => {
    if (!flashListRef.current || !data.messages.length || data.messages.length === 1) return;
    setTimeout(() => {
      flashListRef.current.scrollToIndex({
        index: data.messages.length - 1,
        animated: true,
      });
    }, 300);
  };
  const message = data?.messages?.[0];
  const isLoadingDetail = !data && (isLoading || isFetching);

  const labels = (message?.labels ?? [])
    .filter(Boolean)
    .map((label) => label.toLowerCase().replaceAll(/_/g, ' ').replaceAll('category', '').trim())
    .filter((label) => label !== 'unread');

  const isSenderAndRecipientSame =
    (labels.includes(EMAIL_LABEL_SENT) || labels.includes(EMAIL_LABEL_SENT_ITEMS)) &&
    labels.includes(EMAIL_LABEL_INBOX);

  const renderButton = () => {
    if (data.hasNut || isSenderAndRecipientSame) return null;
    if (selectEmailType === TYPE_EMAIL_HUB.SPAM) {
      return (
        <Button
          startIcon={<ShieldCheckIcon size={18} color={colors.white} />}
          colorScheme="green"
          onPress={() => modalReportRef.current.showModalReport()}
        >
          <Text style={[fonts.size_14, fonts.white, fonts.medium]}>Report Not Spam</Text>
        </Button>
      );
    }

    return (
      <Button
        startIcon={<ArrowPathRoundedSquareIcon size={18} color={colors.white} />}
        colorScheme="green"
        onPress={() => modalConvertRef.current.showModalConvert()}
      >
        <Text style={[fonts.size_14, fonts.white, fonts.medium]}>Convert to Nut</Text>
      </Button>
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <Box px={3}>
        <NavbarWrapper shouldShowBackButton />
      </Box>
      {isLoadingDetail ? (
        <Spinner color={colors.green600} />
      ) : (
        <FlashList
          ref={flashListRef}
          contentContainerStyle={styles.content}
          estimatedItemSize={100}
          maximumZoomScale={2}
          minimumZoomScale={1}
          ListHeaderComponent={
            <React.Fragment>
              <Text style={[fonts.size_16, fonts.medium]}>{removeQuotes(message.subject)}</Text>
              <HStack space={2} mt={2} flexWrap="wrap">
                {message.labels.map((label) => (
                  <Box
                    key={label}
                    alignItems="center"
                    justifyContent="center"
                    bg="gray.100"
                    px={2}
                    py={1.5}
                    borderRadius={4}
                    mb={1.5}
                  >
                    <Text style={[fonts.size_12, fonts.gray700, fonts.medium]}>
                      {capitalizeFirstLetter(label.replace('CATEGORY_', ''))}
                    </Text>
                  </Box>
                ))}
                {data.hasNut && !isSenderAndRecipientSame && (
                  <HStack mb={1.5} space={1} alignItems="center">
                    <Text style={[fonts.size_12, fonts.green600, fonts.medium]}>Email is Nut</Text>
                    <Images.IC_NUT
                      width={16}
                      height={16}
                      color={colors.green600}
                      fill={colors.green600}
                    />
                  </HStack>
                )}
              </HStack>
            </React.Fragment>
          }
          data={data.messages}
          renderItem={({ item, index }) => (
            <MessageItem
              email={item}
              show={index === data.messages.length - 1}
              scrollToItem={scrollToItem}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      {data && (
        <>
          <Box px={3} mb={2}>
            {renderButton()}
          </Box>
          <ModalConvert
            item={data}
            ref={modalConvertRef}
            selectMailboxUser={user}
            callbackSuccess={refetch}
          />
          <ModalReport
            item={data}
            ref={modalReportRef}
            selectMailboxUser={user}
            callbackSuccess={refetch}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default EmailHubDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 14,
    flexGrow: 1,
    paddingBottom: 40,
  },
});
