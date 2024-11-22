import { Input, Text } from '@/components/atoms';
import Button from '@/components/atoms/ButtonVariant';
import Spinner from '@/components/atoms/Spinner';
import { debounce } from '@/helpers';
import { extractContactDisplayName } from '@/helpers/content';
import useNavigator from '@/helpers/hooks/use-navigation';
import { useGetAllContactTagsQuery, useGetContactsQuery } from '@/store/services';
import { useTheme } from '@/theme';
import defaultAvatar from '@/theme/assets/images/default-avatar.jpeg';
import { useFocusEffect } from '@react-navigation/native';
import { Avatar, FlatList, HStack, VStack } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';
import { useDispatch } from 'react-redux';

function ContactsList({ navigation }) {
  const { layout, gutters, fonts, colors, borders, backgrounds, effects } = useTheme();

  const dispatch = useDispatch();
  const navigator = useNavigator();

  const [tags, setTag] = useState('');
  const [keywords, setKeywords] = useState('');
  const [debouncedKeywords, setDebouncedKeywords] = useState(keywords);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // For selecting with Shift key
  const [activeRows, setActiveRows] = useState({});
  const [lastSelectedIndex, setLastSelectedIndex] = useState(undefined);

  const { data: activeTagsResponse } = useGetAllContactTagsQuery(
    {
      slugs: tags,
    },
    {
      skip: tags?.length <= 0,
    },
  );

  const {
    data: contactsResponse,
    isFetching,
    refetch,
  } = useGetContactsQuery({
    keywords: debouncedKeywords || '',
    page: page || 1,
    perPage: perPage || 10,
    tags: tags || '',
  });

  const contacts = contactsResponse?.data ?? [];
  const meta = contactsResponse?.meta ?? {};
  const isLastPage = meta?.pagination?.currentPage === meta?.pagination?.lastPage;

  const debounceKeywords = useCallback(
    debounce(async (keywords) => {
      setDebouncedKeywords(keywords);
    }, 200),
    [],
  );

  const menuItems = [
    {
      id: 1,
      label: 'Delete',
      icon: () => <Icons.TrashIcon size={12} color={colors.gray900} />,
      onPress: () => {
        console.log('Delete');
      },
    },
    {
      id: 2,
      label: 'Import CSV',
      icon: () => <Icons.ArrowDownOnSquareIcon size={12} color={colors.gray900} />,
      onPress: () => {
        console.log('Import CSV');
      },
    },
  ];

  useEffect(() => {
    debounceKeywords(keywords);
  }, [keywords]);

  useFocusEffect(
    useCallback(() => {
      refetch();
      return () => {};
    }, []),
  );

  return (
    <>
      <HStack style={[gutters.marginB_12]} w={'100%'} space={2} alignItems="stretch">
        <Input
          containerStyle={[layout.flex_1]}
          leftIcon={() => <Icons.MagnifyingGlassIcon color={colors.gray600} size={16} />}
          style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
          innerStyle={[fonts.size_14, fonts.gray900]}
          value={keywords}
          placeholder="Search name, phone, email, or company"
          onChangeText={setKeywords}
        />

        {/*<Menu*/}
        {/*  style={[gutters.marginT_4]}*/}
        {/*  px={0}*/}
        {/*  py={0}*/}
        {/*  placement="bottom right"*/}
        {/*  trigger={(triggerProps) => {*/}
        {/*    return (*/}
        {/*      <Button*/}
        {/*        size={8}*/}
        {/*        style={[borders.none, effects.shadow_1]}*/}
        {/*        variant="outline"*/}
        {/*        backgroundColor="white"*/}
        {/*        {...triggerProps}*/}
        {/*      >*/}
        {/*        <Icons.FunnelIcon size={15} color={colors.gray900} />*/}
        {/*      </Button>*/}
        {/*    );*/}
        {/*  }}*/}
        {/*>*/}
        {/*  {menuItems.map((item) => (*/}
        {/*    <Menu.Item*/}
        {/*      style={[borders._1, borders.gray200, fonts.size_10]}*/}
        {/*      px={3}*/}
        {/*      py={3}*/}
        {/*      _text={{ color: colors.gray900, fontSize: 12 }}*/}
        {/*      key={item.id}*/}
        {/*      onPress={item.onPress}*/}
        {/*    >*/}
        {/*      {item.icon()}*/}
        {/*      {item.label}*/}
        {/*    </Menu.Item>*/}
        {/*  ))}*/}
        {/*</Menu>*/}
      </HStack>

      <FlatList
        loading={isFetching}
        LoadingComponent={Spinner}
        refreshing={isFetching}
        ListEmptyComponent={
          <View
            style={[layout.column, layout.itemsCenter, gutters.paddingH_12, gutters.paddingT_80]}
          >
            <Icons.UsersIcon style={[gutters.marginB_16]} size={50} color={colors.green600} />

            <Text style={[fonts.size_14_150, fonts.center, fonts.gray800]}>
              There is no Contact yet. Please click the
            </Text>

            <HStack alignItems="center" space={2}>
              <Icons.UserPlusIcon style={[gutters.marginT_6]} size={24} color={colors.green600} />
              <Text style={[fonts.size_14_150, fonts.center, fonts.gray800]}>
                button to create one.
              </Text>
            </HStack>
          </View>
        }
        onRefresh={() => {
          setPerPage(10);
          refetch();
        }}
        data={contacts}
        renderItem={({ item: contact }) => {
          const { id, avatar, email, phone, contactTags } = contact;

          const displayName = extractContactDisplayName(contact);

          return (
            <Button
              key={id}
              type="native"
              onPress={() => {
                navigator.navigate('ContactDetailsScreen', {
                  contact,
                });
              }}
            >
              <HStack
                style={[
                  layout.row,
                  layout.itemsCenter,
                  layout.justifyBetween,
                  gutters.marginT_12,
                  gutters.padding_8,
                  borders.rounded_6,
                  backgrounds.white,
                ]}
                space={2}
                width="100%"
              >
                <Avatar
                  alignSelf="flex-start"
                  size={9}
                  source={avatar ? { uri: avatar } : defaultAvatar}
                />

                <VStack flex={1} space={2} alignItems="flex-start" justifyItems="start">
                  <Text style={[fonts.size_15, fonts.medium, fonts.gray700]}>{displayName}</Text>

                  {Boolean(phone || email) && (
                    <Text style={[fonts.size_14_150, fonts.gray500]}>
                      {phone} - {email}
                    </Text>
                  )}

                  {contactTags?.length > 0 && (
                    <HStack space={1.5}>
                      {contactTags.map((tag) => (
                        <Button
                          px={1.5}
                          py={1}
                          variant="outline"
                          style={[borders._1, borders.rounded_6, borders.green600]}
                        >
                          <Text style={[fonts.green600, fonts.size_10, fonts.medium]}>
                            {tag.name}
                          </Text>
                        </Button>
                      ))}
                    </HStack>
                  )}
                </VStack>
              </HStack>
            </Button>
          );
        }}
        keyExtractor={(item, index) => index?.id ?? index}
        onEndReached={() => {
          if (!isFetching && !isLastPage) {
            setPerPage(perPage + 10);
          }
        }}
        onEndReachedThreshold={0.5}
      />

      {/*{isFetching ? (*/}
      {/*  <Spinner />*/}
      {/*) : (*/}
      {/*  */}
      {/*)}*/}
    </>
  );
}

export default ContactsList;
