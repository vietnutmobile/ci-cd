import { Text } from '@/components/atoms';
import Button from '@/components/atoms/ButtonVariant';
import Spinner from '@/components/atoms/Spinner';
import { isNullOrUndefined } from '@/helpers';
import { colorPalette } from '@/helpers/constants';
import useNavigator from '@/helpers/hooks/use-navigation';
import { useGetOrganizationInfosQuery, useGetUserProfileQuery } from '@/store/services';
import { useTheme } from '@/theme';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { HStack } from 'native-base';
import { useCallback } from 'react';
import * as Icons from 'react-native-heroicons/outline';

function PipelinesList({ navigation }) {
  const { layout, gutters, fonts, colors, borders } = useTheme();

  const navigator = useNavigator();

  const { data: userData } = useGetUserProfileQuery();

  const orgId = userData?.orgId ?? '';

  const {
    data: organization,
    isLoading,
    refetch,
  } = useGetOrganizationInfosQuery(
    { orgId },
    {
      skip: !orgId,
    },
  );

  const pipelines = organization?.pipeLines ?? [];

  const handleRefresh = useCallback(() => {
    if (organization && refetch) {
      refetch();
    }
  }, [refetch, organization]);

  useFocusEffect(handleRefresh);

  return (
    <>
      {(isNullOrUndefined(pipelines) || pipelines?.length <= 0) && (
        <Text style={[fonts.size_14, fonts.medium, colors.gray500, gutters.marginT_12]}>
          No pipelines to show, please visit Nutsales app to create one.
        </Text>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        pipelines?.length > 0 && (
          <FlashList
            estimatedItemSize={20}
            emptyText="No pipelines to show, please visit Nutsales app to create one."
            refreshing={isLoading}
            onRefresh={() => {
              handleRefresh();
            }}
            data={pipelines}
            renderItem={({ item: pipeline, index }) => {
              const { id, name } = pipeline;

              return (
                <Button
                  key={id}
                  type="native"
                  onPress={() => {
                    navigator.navigate('PipelineDetailsScreen', {
                      pipeline,
                    });
                  }}
                  testID={`button_${name}`}
                >
                  <HStack
                    backgroundColor={colorPalette[index % (colorPalette.length - 1)]}
                    px={4}
                    py={3}
                    justifyContent="space-between"
                    alignItems="center"
                    style={[
                      layout.row,
                      layout.itemsCenter,
                      layout.justifyBetween,
                      gutters.marginT_12,
                      borders.rounded_6,
                    ]}
                    space={2}
                    width="100%"
                  >
                    <Icons.Squares2X2Icon size={18} color={colors.white} />
                    <Text style={[fonts.size_15, fonts.medium, fonts.white]}>{name}</Text>
                    {/*<Icons.ChevronRightIcon size={15} color={colors.white} />*/}

                    <HStack flex={1} justifyContent="flex-end" space={3}>
                      <Icons.ChevronRightIcon size={15} color={colors.white} />
                      {/*<Button*/}
                      {/*  size={7}*/}
                      {/*  style={[borders.none]}*/}
                      {/*  backgroundColor={'rgba(255,255,255,0.25)'}*/}
                      {/*  onPress={() => {}}*/}
                      {/*>*/}
                      {/*  <Icons.PencilIcon size={16} color={colors.white} />*/}
                      {/*</Button>*/}

                      {/*<Button*/}
                      {/*  size={7}*/}
                      {/*  style={[borders.none]}*/}
                      {/*  backgroundColor={'rgba(255,255,255,0.25)'}*/}
                      {/*  onPress={() => {}}*/}
                      {/*>*/}
                      {/*  <Icons.TrashIcon size={16} color={colors.white} />*/}
                      {/*</Button>*/}
                    </HStack>
                  </HStack>
                </Button>
              );
            }}
            keyExtractor={(item, index) => index?.id ?? index}
            onEndReached={() => {}}
            onEndReachedThreshold={0.5}
          />
        )
      )}
    </>
  );
}

export default PipelinesList;
