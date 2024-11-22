import { Text } from '@/components/atoms';
import Button from '@/components/atoms/ButtonVariant';
import Spinner from '@/components/atoms/Spinner';
import { colorPalette } from '@/helpers/constants';
import useNavigator from '@/helpers/hooks/use-navigation';
import { useGetHotNutsQuery, useGetUserProfileQuery } from '@/store/services';
import { useTheme } from '@/theme';
import { Images } from '@/theme/ImageProvider';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { FlatList, HStack, VStack } from 'native-base';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';
import { useDispatch } from 'react-redux';

function HotNuts({ navigation }) {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigator = useNavigator();

  const { layout, gutters, fonts, colors, borders, backgrounds, effects } = useTheme();

  const { data: userData } = useGetUserProfileQuery();

  const currentUserId = userData?.id ?? '';

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const {
    data: nutsResponse,
    isLoading,
    refetch: refetchNuts,
  } = useGetHotNutsQuery(
    {
      assignedUserId: currentUserId,
      page: parseInt(page, 10) || 1,
      perPage: parseInt(perPage, 10) || 20,
    },
    {
      skip: !currentUserId,
    },
  );

  const nuts = useMemo(() => nutsResponse?.data ?? [], [nutsResponse?.data]);

  useFocusEffect(
    useCallback(() => {
      if (currentUserId) {
        refetchNuts();
      }
    }, [refetchNuts, currentUserId]),
  );

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <HStack
            backgroundColor={colorPalette[0]}
            px={3}
            py={2}
            justifyContent="space-between"
            alignItems="center"
            style={[
              layout.row,
              layout.itemsCenter,
              layout.justifyBetween,
              gutters.marginT_12,
              gutters.padding_8,
              borders.rounded_6,
            ]}
            space={2}
          >
            <HStack flex={1} justifyContent="flex-start" alignItems="center" space={2}>
              <Icons.FireIcon size={20} color={colors.white} />
              <Text style={[fonts.size_15, fonts.medium, fonts.white]}>Assigned Nuts</Text>
            </HStack>

            <View
              style={[
                {
                  paddingHorizontal: 3,
                  paddingVertical: 1,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                },
              ]}
            >
              <Text style={[gutters.padding_2, fonts.size_15, fonts.medium, fonts.white]}>
                {nuts.length}
              </Text>
            </View>
          </HStack>

          <FlatList
            style={[gutters.paddingT_12]}
            refreshing={isLoading}
            ListEmptyComponent={
              <View
                style={[
                  layout.column,
                  layout.itemsCenter,
                  gutters.paddingH_12,
                  gutters.paddingT_80,
                ]}
              >
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
            }
            onRefresh={() => {
              setPerPage('10');
              refetchNuts();
            }}
            data={nuts}
            renderItem={({ item: nut }) => {
              const { id, name, assignedUser, stage } = nut;
              //
              // const assigneeName =
              //   assignedUser?.name || getUserNameFromEmail(assignedUser?.email ?? '');

              return (
                <Button
                  style={[
                    {
                      minWidth: '100%',
                    },
                  ]}
                  key={id}
                  type="native"
                  onPress={() => {
                    navigator.navigate('NutDetailsScreen', {
                      nutId: id,
                    });
                  }}
                >
                  <VStack
                    style={[
                      gutters.marginB_12,
                      gutters.padding_14,
                      borders.rounded_4,
                      backgrounds.white,
                    ]}
                    alignItems="flex-start"
                    justifyContent="space-between"
                    space={2}
                  >
                    <Text
                      style={[fonts.size_15, fonts.medium, fonts.gray800]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {name.trim()}
                    </Text>
                    <Text style={[fonts.size_14, fonts.medium, fonts.gray500, fonts.green600]}>
                      <Text style={[fonts.gray600]}>Stage:</Text> {stage?.name ?? ''}
                    </Text>
                  </VStack>
                </Button>
              );
            }}
            keyExtractor={(item, index) => index?.id ?? index.toString()}
            onEndReached={() => {
              setPerPage(perPage + 10);
            }}
            onEndReachedThreshold={0.5}
          />
        </>
      )}
    </>
  );
}

export default HotNuts;
