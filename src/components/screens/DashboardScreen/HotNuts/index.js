import { Text } from '@/components/atoms';
import Button from '@/components/atoms/ButtonVariant';
import Spinner from '@/components/atoms/Spinner';
import { colorPalette } from '@/helpers/constants';
import useNavigator from '@/helpers/hooks/use-navigation';
import {
  useGetHotNutsQuery,
  useGetNutsSummaryQuery,
  useGetUserProfileQuery,
} from '@/store/services';
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
  const { data: nutsSummary, isFetching } = useGetNutsSummaryQuery({
    isAllNuts: 1,
    page: 1,
    perPage: 20,
  });

  console.log('nutsSummary', nutsSummary);

  const nuts = nutsSummary?.data ?? [];

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
        <FlatList
          style={[gutters.paddingT_12]}
          refreshing={isLoading}
          ListEmptyComponent={
            <View
              style={[layout.column, layout.itemsCenter, gutters.paddingH_12, gutters.paddingT_80]}
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
      )}
    </>
  );
}

export default HotNuts;
