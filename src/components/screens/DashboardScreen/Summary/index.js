import { Text } from '@/components/atoms';
import Button from '@/components/atoms/ButtonVariant';
import Spinner from '@/components/atoms/Spinner';
import { getUserNameFromEmail } from '@/helpers/content';
import useNavigator from '@/helpers/hooks/use-navigation';
import FooterEmailHub from '@/screens/EmailHubScreen/components/FooterEmailHub';
import {
  useGetNutsSummaryQuery,
  useGetUserProfileQuery,
  useLazyGetNutsSummaryQuery,
} from '@/store/services';
import { useTheme } from '@/theme';
import { Images } from '@/theme/ImageProvider';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { format } from 'date-fns';
import { Avatar, Box, HStack, VStack } from 'native-base';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

const EmptyComponent = () => {
  const { layout, gutters, fonts, colors } = useTheme();

  return (
    <View style={[layout.column, layout.itemsCenter, gutters.paddingH_12, gutters.paddingT_80]}>
      <Images.IC_NUT
        style={[gutters.marginB_16]}
        width={60}
        height={60}
        color={colors.green600}
        fill={colors.green600}
      />
      <Text style={[fonts.size_14, fonts.center, fonts.gray800]}>
        There is no Nuts assigned to you yet
      </Text>
    </View>
  );
};

const FooterFlashList = ({ loading, data }) => {
  const { fonts, gutters } = useTheme();

  if (loading && data.length !== 0) {
    return (
      <Box py={4} alignItems="center">
        <ActivityIndicator />
      </Box>
    );
  }
  if (!loading && data.length > 4) {
    return (
      <Text style={[fonts.size_15, fonts.gray500, fonts.center, gutters.marginV_12]}>
        End of list.
      </Text>
    );
  }
  return null;
};

const PER_PAGE = 20;

export const getCurrentState = async (useStateFunc) => {
  return new Promise((rs) => {
    useStateFunc((pre) => {
      rs(pre);
      return pre;
    });
  });
};

function Summary({ isAllNuts, keywords, from, to, assignees }) {
  const navigator = useNavigator();
  const { layout, gutters, fonts, colors, borders, backgrounds } = useTheme();
  const [page, setPage] = useState(1);
  const [nuts, setNuts] = useState([]);
  const [refetching, setRefetching] = useState(false);
  const [stopLoading, setStopLoading] = useState(false);
  const isLoadMore = useRef(false);
  const timer = useRef(null);

  const [getNutsSummary] = useLazyGetNutsSummaryQuery();

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      onRefetch();
    }, 300);
  }, [isAllNuts, keywords, from, to, assignees]);

  const onRefetch = async () => {
    isLoadMore.current = false;
    setNuts([]);
    setRefetching(true);
    setStopLoading(false);
    getData();
  };

  const getData = async () => {
    const res = await getNutsSummary({
      isAllNuts,
      keywords,
      from,
      to,
      assignees: assignees.map((i) => i.id).join(','),
      page: 1,
      perPage: PER_PAGE,
    }).unwrap();
    setNuts(res.data ?? []);
    setRefetching(false);
    if (res.meta?.pagination?.lastPage <= 1) {
      setStopLoading(true);
    }
  };

  const loadMore = async () => {
    if (isLoadMore.current || stopLoading) return;
    isLoadMore.current = true;
    setPage((p) => p + 1);
    let currentPage = await getCurrentState(setPage);
    const res = await getNutsSummary({
      isAllNuts,
      keywords,
      from,
      to,
      assignees: assignees.map((i) => i.id).join(','),
      page: currentPage,
      perPage: PER_PAGE,
    }).unwrap();
    setNuts((prev) => [...prev, ...(res.data ?? [])]);
    isLoadMore.current = false;
    if (currentPage < res.meta?.pagination?.lastPage) {
      setPage(currentPage + 1);
    } else {
      setStopLoading(true);
    }
  };

  const renderItem = ({ item: nut }) => {
    const { id, name, assignedUser, stage } = nut;
    const assigneeName = assignedUser?.name || getUserNameFromEmail(assignedUser?.email ?? '');
    const email = nut.emails?.[0];
    return (
      <TouchableOpacity
        onPress={() => {
          navigator.navigate('NutDetailsScreen', {
            nutId: id,
          });
        }}
      >
        <VStack
          style={[gutters.marginT_12, gutters.padding_14, borders.rounded_4, backgrounds.white]}
          space={2}
        >
          <HStack alignItems="center">
            <Text
              style={[fonts.size_15, fonts.medium, fonts.gray800, layout.flex_1]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {name.trim()}
            </Text>
            <Avatar
              size="sm"
              source={assignedUser?.image ? { uri: assignedUser?.image } : undefined}
              style={[gutters.marginL_8]}
              bg={colors.green600}
            >
              {assigneeName[0].toUpperCase()}
            </Avatar>
          </HStack>
          {!!email?.messageBody && (
            <Text numberOfLines={1} ellipsizeMode="tail" style={[fonts.size_13]}>
              {email?.messageBody}
            </Text>
          )}
          {!!email?.sender && <Text style={[fonts.size_13, fonts.gray500]}>{email?.sender}</Text>}
          <Text style={[fonts.size_14, fonts.medium, fonts.gray500]}>
            {stage?.pipeline?.name ?? ''}
            {' > '}
            <Text style={[fonts.blue700]}>{stage?.name ?? ''}</Text>
          </Text>
          {email?.date ? (
            <Text style={[fonts.size_12, layout.flex_1, fonts.gray500, { textAlign: 'right' }]}>
              {format(email?.date, 'MMM dd, yyyy, h:mm a')}
            </Text>
          ) : null}
        </VStack>
      </TouchableOpacity>
    );
  };

  return (
    <FlashList
      data={nuts}
      estimatedItemSize={100}
      refreshing={refetching}
      ListEmptyComponent={!refetching && stopLoading && <EmptyComponent />}
      ListFooterComponent={<FooterFlashList loading={!stopLoading} data={nuts} />}
      onRefresh={onRefetch}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      renderItem={renderItem}
      keyExtractor={(item, index) => item?.id ?? index.toString()}
    />
  );
}

export default Summary;
