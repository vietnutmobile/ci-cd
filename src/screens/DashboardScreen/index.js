/* eslint-disable react-native/no-inline-styles */
import { Input, Text } from '@/components/atoms';
import DatePickerRange from '@/components/modules/Date/DatePickerRange';
import HotNuts from '@/components/screens/DashboardScreen/HotNuts';
import SelectUser from '@/components/screens/DashboardScreen/SelectUser';
import Summary from '@/components/screens/DashboardScreen/Summary';
import { getUserNameFromEmail } from '@/helpers/content';
import {
  useGetCountUnreadNotificationsQuery,
  useGetOrganizationMembersQuery,
  useGetUserProfileQuery,
} from '@/store/services';
import { useTheme } from '@/theme';
import dayjs from 'dayjs';
import { Flex, HStack } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FunnelIcon, MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
const TABS = [
  {
    title: 'Assigned to me',
    key: 'assigned',
    id: 'assigned',
  },
  {
    title: 'All Nuts',
    key: 'organization',
    id: 'organization',
  },
];

const DashboardScreen = () => {
  const { data: user } = useGetUserProfileQuery();
  const { data: noticount } = useGetCountUnreadNotificationsQuery(
    {
      userId: user?.id,
    },
    {
      skip: !user?.id,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    },
  );
  const orgId = user?.orgId ?? '';
  const { data: orgMembers } = useGetOrganizationMembersQuery(
    { orgId },
    {
      skip: !orgId,
    },
  );
  console.log('orgMembers', orgMembers);
  const [showFilter, setShowFilter] = useState(false);
  const [dataSearch, setDataSearch] = useState({
    isAllNuts: 0,
    keywords: '',
    from: '',
    to: '',
    assignees: [],
  });

  const { layout, fonts, gutters, backgrounds, colors, borders } = useTheme();

  const setQuerySearch = (data) => {
    setDataSearch((p) => ({
      ...p,
      ...data,
    }));
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, backgrounds.gray100]}>
      <HStack justifyContent="space-between">
        <Text style={[gutters.paddingV_12, gutters.paddingH_12, fonts.size_16, fonts.gray_800]}>
          Welcome
          {user?.name && (
            <>
              {', '}
              <Text style={[fonts.size_16, fonts.gray_800, fonts.bold]}>
                {user?.name ?? getUserNameFromEmail(user?.email) ?? ''}
              </Text>
            </>
          )}
        </Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilter((p) => !p)}>
          <FunnelIcon size={24} color={showFilter ? colors.green600 : colors.gray500} />
        </TouchableOpacity>
      </HStack>
      <HStack style={styles.tabs}>
        {TABS.map((tab) => {
          const isActive = dataSearch.isAllNuts === (tab.id === 'organization' ? 1 : 0);
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabItem,
                {
                  borderBottomColor: isActive ? colors.green600 : 'transparent',
                },
              ]}
              onPress={() => {
                setQuerySearch({
                  isAllNuts: tab.id === 'organization' ? 1 : 0,
                });
              }}
            >
              <Text
                style={[
                  fonts.size_13,
                  { color: isActive ? colors.green600 : colors.gray400 },
                  fonts.bold,
                ]}
              >
                {tab.title}
              </Text>
              {noticount?.unread ? (
                <View style={styles.countUnread}>
                  <Text
                    style={[
                      fonts.size_10,
                      noticount.unread[tab.id] ? fonts.red500 : fonts.green600,
                      fonts.gray_800,
                      { opacity: isActive ? 1 : 0.4 },
                    ]}
                  >
                    ({noticount.unread[tab.id]} unread)
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </HStack>
      <View style={[layout.flex_1, gutters.paddingH_12]}>
        {showFilter ? (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Input
              containerStyle={[layout.width_100, gutters.paddingB_6]}
              leftIcon={() => <MagnifyingGlassIcon color={colors.gray600} size={16} />}
              style={[
                gutters.paddingH_12,
                gutters.paddingV_8,
                borders.rounded_4,
                gutters.marginT_4,
              ]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={dataSearch.keywords}
              placeholder="Search..."
              onChangeText={(text) => setQuerySearch({ keywords: text })}
              rightIcon={
                dataSearch.keywords
                  ? () => (
                      <TouchableOpacity
                        style={styles.btnClear}
                        onPress={() => setQuerySearch({ keywords: '' })}
                      >
                        <XMarkIcon color={colors.gray600} size={12} />
                      </TouchableOpacity>
                    )
                  : undefined
              }
            />
            <HStack space={2}>
              <Flex flex={1.64}>
                <DatePickerRange
                  value={{
                    startDate: dataSearch.from,
                    endDate: dataSearch.to,
                  }}
                  onChange={(data) =>
                    setQuerySearch({
                      from: data.startDate,
                      to: data.endDate,
                    })
                  }
                />
              </Flex>
              <Flex flex={1}>
                <SelectUser
                  users={orgMembers.map((i) => {
                    return {
                      ...i,
                      avatar: i.image ?? '',
                    };
                  })}
                  onSelectUsers={(users) => {
                    setQuerySearch({
                      assignees: users,
                    });
                  }}
                  initialUsers={dataSearch.assignees}
                />
              </Flex>
            </HStack>
          </Animated.View>
        ) : null}
        <Summary
          isAllNuts={dataSearch.isAllNuts}
          keywords={dataSearch.keywords}
          from={dataSearch.from ? dayjs(dataSearch.from).format('YYYY-MM-DD') : ''}
          to={dataSearch.to ? dayjs(dataSearch.to).format('YYYY-MM-DD') : ''}
          assignees={dataSearch.assignees}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 8,
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabs: {
    backgroundColor: '#FAFAFA',
    marginHorizontal: 12,
    borderRadius: 4,
    padding: 2,
  },
  filterButton: {
    padding: 10,
  },
  btnClear: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  countUnread: {
    marginLeft: 6,
  },
});

export default DashboardScreen;
