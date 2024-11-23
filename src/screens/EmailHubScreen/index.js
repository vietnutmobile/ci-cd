/* eslint-disable react-native/no-inline-styles */
import { Input, Text } from '@/components/atoms';
import SafeScreen from '@/components/modules/SafeScreen';
import {
  useGetEmailhubQuery,
  useGetOrganizationInfosQuery,
  useGetUserProfileQuery,
} from '@/store/services';
import { useTheme } from '@/theme';
import debounce from 'lodash/debounce';
import { Box, HStack, View } from 'native-base';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import * as Icons from 'react-native-heroicons/outline';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import EmptyEmailHub from './components/EmptyEmailHub';
import FooterEmailHub from './components/FooterEmailHub';
import ItemEmailHub from './components/itemEmailHub/ItemEmailHub';

export const TYPE_EMAIL_HUB = {
  INBOX: 'Inbox',
  SPAM: 'Spam',
  SENT: 'Sent',
};

const DEBOUNCE_DELAY = 500;
const SCROLL_THRESHOLD = 35;
const HEADER_HEIGHT = 80;

const EmailHubScreen = () => {
  const { layout, fonts, borders, gutters, backgrounds, colors } = useTheme();

  // State
  const [workspaceEmails, setWorkspaceEmails] = useState([]);
  const [selectEmailType, setSelectMailType] = useState(TYPE_EMAIL_HUB.INBOX);
  const [selectMailboxUser, setSelectMailboxUser] = useState();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [pageToken, setPageToken] = useState('');
  const [emails, setEmails] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // Scroll
  const lastScrollY = useSharedValue(0);
  const headerVisible = useSharedValue(0);

  const { data: userData } = useGetUserProfileQuery();

  const orgId = userData?.orgId ?? '';

  const { data: organization } = useGetOrganizationInfosQuery({ orgId }, { skip: !orgId });

  // API Query
  const {
    data: emailhubResponse,
    refetch,
    isFetching,
  } = useGetEmailhubQuery(
    {
      userId: selectMailboxUser?.id || '',
      label: selectEmailType.toLowerCase(),
      search: debouncedSearch,
      nextPageToken: pageToken,
    },
    {
      skip: !selectMailboxUser,
    },
  );

  useEffect(() => {
    if (organization) {
      setWorkspaceEmails(organization.workspaceEmails);
      if (organization.workspaceEmails.length > 0 && !selectMailboxUser) {
        setSelectMailboxUser(organization.workspaceEmails[0]);
      }
    }
  }, [organization]);

  // Debounced search handler
  const debouncedSearchHandler = useMemo(
    () =>
      debounce((text) => {
        setDebouncedSearch(text);
      }, DEBOUNCE_DELAY),
    [],
  );

  // Handle search input changes
  const handleSearchChange = useCallback(
    (text) => {
      setSearchInput(text);
      debouncedSearchHandler(text);
    },
    [debouncedSearchHandler],
  );

  // Reset data when filters change
  useEffect(() => {
    setPageToken('');
    setEmails([]);
  }, [selectEmailType, debouncedSearch, selectMailboxUser]);

  // Handle email data updates
  useEffect(() => {
    if (emailhubResponse?.threads) {
      if (pageToken === '') {
        setEmails(emailhubResponse.threads);
      } else if (
        emailhubResponse.threads.length > 0 &&
        pageToken !== emailhubResponse.nextPageToken
      ) {
        setEmails((prev) => [...prev, ...emailhubResponse.threads]);
      }
    }
  }, [emailhubResponse]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearchHandler.cancel();
    };
  }, [debouncedSearchHandler]);

  // Handlers
  const handleLoadMore = useCallback(() => {
    if (emailhubResponse?.nextPageToken) {
      setIsLoading(true);
      setPageToken(emailhubResponse.nextPageToken);
    }
  }, [emailhubResponse?.nextPageToken]);

  const handleRefresh = useCallback(async () => {
    headerVisible.value = withTiming(-HEADER_HEIGHT, { duration: 100 });
    setRefreshing(true);
    setPageToken('');
    await refetch();
    setRefreshing(false);
    setTimeout(() => {
      headerVisible.value = withTiming(0, { duration: 200 });
    }, 150);
  }, [refetch]);

  useEffect(() => {
    if (isFetching) setIsLoading(true);
    if (!isFetching) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isFetching]);

  // Render functions
  const renderEmailTypeIcon = useCallback(
    (type) => {
      const iconProps = {
        size: 20,
        style: [gutters.marginR_8, gutters.marginL_4],
        color: colors.black,
      };
      switch (type) {
        case TYPE_EMAIL_HUB.INBOX:
          return <Icons.EnvelopeIcon {...iconProps} />;
        case TYPE_EMAIL_HUB.SPAM:
          return <Icons.EnvelopeOpenIcon {...iconProps} />;
        case TYPE_EMAIL_HUB.SENT:
          return <Icons.PaperAirplaneIcon {...iconProps} />;
        default:
          return null;
      }
    },
    [colors.black, gutters.marginR_8, gutters.marginL_4],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const scrollDelta = currentScrollY - lastScrollY.value;

      if (Math.abs(scrollDelta) >= SCROLL_THRESHOLD) {
        if (currentScrollY > lastScrollY.value && currentScrollY > HEADER_HEIGHT) {
          headerVisible.value = withTiming(-HEADER_HEIGHT, { duration: 300 });
        } else if (currentScrollY < lastScrollY.value) {
          headerVisible.value = withTiming(0, { duration: 300 });
        }
        lastScrollY.value = currentScrollY;
      }
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerVisible.value }],
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
  }));

  return (
    <SafeScreen safeAreaBottom={false} style={[backgrounds.gray100]}>
      <Text style={[fonts.size_20, fonts.semi, gutters.paddingV_12]}>Email Hub</Text>

      <HStack style={[gutters.paddingB_10]}>
        <Box flex={1}>
          <Dropdown
            style={styles.dropdown}
            value={selectMailboxUser}
            selectedTextStyle={[fonts.interRegular, fonts.size_14, fonts.medium]}
            labelField="name"
            valueField="id"
            selectedTextProps={{ numberOfLines: 1, ellipsizeMode: 'tail' }}
            renderItem={(item) => (
              <HStack
                alignItems="center"
                key={item.key}
                flex={1}
                style={[gutters.paddingH_10, gutters.paddingV_12]}
              >
                <Text numberOfLines={1} ellipsizeMode="tail" style={[fonts.size_14, fonts.gray900]}>
                  {item.name}
                </Text>
              </HStack>
            )}
            data={workspaceEmails}
            renderRightIcon={() => (
              <Icons.ChevronDownIcon style={[gutters.marginL_8]} size={20} color={colors.black} />
            )}
            onChange={(item) => {
              if (item.id !== selectMailboxUser?.id) {
                setEmails([]);
                setSelectMailboxUser(item);
                handleRefresh();
              }
            }}
          />
        </Box>

        <Box width={2} />

        <Box width={130}>
          <Dropdown
            style={styles.dropdown}
            value={selectEmailType}
            selectedTextStyle={[fonts.interRegular, fonts.size_14, fonts.medium]}
            labelField="label"
            valueField="value"
            renderLeftIcon={() => renderEmailTypeIcon(selectEmailType)}
            renderItem={(item) => (
              <HStack
                alignItems="center"
                key={item.key}
                flex={1}
                style={[gutters.paddingH_10, gutters.paddingV_12]}
              >
                {renderEmailTypeIcon(item.value)}
                <Text numberOfLines={1} ellipsizeMode="tail" style={[fonts.size_14, fonts.gray900]}>
                  {item.label}
                </Text>
              </HStack>
            )}
            data={Object.values(TYPE_EMAIL_HUB).map((emailType) => ({
              key: emailType,
              value: emailType,
              label: emailType,
            }))}
            renderRightIcon={() => (
              <Icons.ChevronDownIcon style={[gutters.marginL_8]} size={20} color={colors.black} />
            )}
            onChange={(item) => setSelectMailType(item.value)}
          />
        </Box>
      </HStack>
      <Box flex={1} style={[{ overflow: 'hidden' }]}>
        <Animated.View style={[backgrounds.gray100, headerStyle]}>
          <Input
            containerStyle={[layout.width_100, gutters.paddingB_8]}
            leftIcon={() => <Icons.MagnifyingGlassIcon color={colors.gray600} size={16} />}
            style={[gutters.paddingH_12, gutters.paddingV_10, borders.rounded_4]}
            innerStyle={[fonts.size_14, fonts.gray900]}
            value={searchInput}
            placeholder="Search email..."
            onChangeText={handleSearchChange}
          />
        </Animated.View>
        <Animated.FlatList
          onScroll={scrollHandler}
          ListHeaderComponent={<View style={{ height: HEADER_HEIGHT - 34 }} />}
          scrollEventThrottle={16}
          contentContainerStyle={{
            // paddingTop: HEADER_HEIGHT - 34,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          data={emails}
          renderItem={({ item }) => (
            <ItemEmailHub
              item={item}
              selectEmailType={selectEmailType}
              selectMailboxUser={selectMailboxUser}
            />
          )}
          ListEmptyComponent={<EmptyEmailHub isFetching={isLoading} refreshing={refreshing} />}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={
            <FooterEmailHub emails={emails} isFetching={isLoading} refreshing={refreshing} />
          }
        />
      </Box>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    height: 40,
  },
});

export default EmailHubScreen;
