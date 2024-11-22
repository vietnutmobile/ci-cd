import { Text } from '@/components/atoms';
import Button from '@/components/atoms/ButtonVariant';
import Spinner from '@/components/atoms/Spinner';
import { colorPalette } from '@/helpers/constants';
import { getUserNameFromEmail } from '@/helpers/content';
import useNavigator from '@/helpers/hooks/use-navigation';
import {
  useGetNutsQuery,
  useGetOrganizationPipelinesAndStagesQuery,
  useGetUserProfileQuery,
} from '@/store/services';
import { useTheme } from '@/theme';
import { Images } from '@/theme/ImageProvider';
import { useRoute } from '@react-navigation/native';
import { Box, FlatList, HStack, VStack } from 'native-base';
import { useEffect, useMemo, useState } from 'react';
import { Animated, View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';

function PipelinesList({ navigation }) {
  const route = useRoute();
  const navigator = useNavigator();

  const { initialStageId } = route.params;

  const { layout, gutters, fonts, colors, borders, backgrounds, effects, dimensions } = useTheme();

  const rotation = useState(new Animated.Value(0))[0];
  const [isLoading, setIsLoading] = useState(true);
  const [activeStageId, setActiveStageId] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { pipeline } = route.params;
  const pipelineId = pipeline?.id ?? '';

  const { data: userData } = useGetUserProfileQuery();

  const orgId = userData?.orgId ?? '';

  const { data: pipelinesAndStagesResponse, refetch: refetchStages } =
    useGetOrganizationPipelinesAndStagesQuery(
      { orgId, pipelineId, skipNutCount: 0 },
      {
        skip: !orgId || !pipelineId,
      },
    );

  const { data: nutsResponse, refetch: refetchNuts } = useGetNutsQuery(
    {
      keywords: '',
      assignedUserId: '',
      stageId: activeStageId || '',
      page: parseInt(page, 10) || 1,
      perPage: parseInt(perPage, 10) || 10,
    },
    {
      skip: !activeStageId,
    },
  );

  const nuts = useMemo(() => nutsResponse?.data ?? [], [nutsResponse?.data]);

  const pipelinesAndStages = useMemo(
    () => pipelinesAndStagesResponse ?? [],
    [pipelinesAndStagesResponse],
  );

  const stages = pipelinesAndStages?.[1] ?? [];
  const activeStage = stages.find((stage) => stage.id === activeStageId) ?? undefined;

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  useEffect(() => {
    if (activeStageId) {
      refetchNuts();
    }
  }, [activeStageId]);

  useEffect(() => {
    refetchStages();
    if (pipelinesAndStages?.length > 0) {
      setIsLoading(false);
    }
  }, [pipelinesAndStages]);

  useEffect(() => {
    setActiveStageId(initialStageId);
  }, [initialStageId]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Box flex={1}>
            <FlatList
              loading={isLoading}
              ListEmptyComponent={
                <Text style={[fonts.size_14_150, fonts.center, fonts.gray800]}>
                  This pipeline has no Stages
                </Text>
              }
              onRefresh={() => {
                refetchStages();
              }}
              refreshing={isLoading}
              data={activeStage ? [activeStage] : stages}
              renderItem={({ item: stage, index }) => {
                const count = stage?._count?.nuts ?? 0;
                const id = stage?.id ?? '';
                const name = stage?.name ?? '';

                return (
                  <Button
                    key={id}
                    type="native"
                    onPress={() => {
                      if (activeStageId === id) {
                        setActiveStageId(undefined);
                        Animated.timing(rotation, {
                          toValue: 0,
                          duration: 200,
                          useNativeDriver: true,
                        }).start();
                      } else {
                        setActiveStageId(id);
                        Animated.timing(rotation, {
                          toValue: 1,
                          duration: 200,
                          useNativeDriver: true,
                        }).start();
                      }
                    }}
                  >
                    <HStack
                      backgroundColor={colorPalette[index]}
                      px={3}
                      py={3}
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
                      <HStack flex={1} justifyContent="space-between" alignItems="center" space={2}>
                        <Text style={[fonts.size_15, fonts.medium, fonts.white]}>{name}</Text>
                        <Animated.View style={[animatedStyle]}>
                          <Icons.ChevronRightIcon size={12} color={colors.white} />
                        </Animated.View>
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
                          {count}
                        </Text>
                      </View>
                    </HStack>
                  </Button>
                );
              }}
              keyExtractor={(item, index) => index?.id ?? index}
              onEndReached={() => {}}
              onEndReachedThreshold={0.5}
            />
          </Box>

          {activeStageId && (
            <FlatList
              style={[gutters.paddingT_12]}
              refreshing={isLoading}
              onRefresh={() => {
                setPerPage('10');
                refetchNuts();
              }}
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
                  <Text style={[fonts.size_14_150, fonts.center, fonts.gray800]}>
                    There is no Nut in this Stage yet. Please click
                  </Text>

                  <Text style={[fonts.size_14_150, fonts.center, fonts.gray800]}>
                    <Text style={[fonts.size_14_150, fonts.green600]}> Nut +</Text> button to create
                    one.
                  </Text>
                </View>
              }
              data={nuts}
              renderItem={({ item: nut }) => {
                const { id, name, assignedUser, stage } = nut;
                const assigneeName =
                  assignedUser?.name || getUserNameFromEmail(assignedUser?.email ?? '');

                return (
                  <Button
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
                        gutters.padding_12,
                        borders.rounded_4,
                        backgrounds.white,
                      ]}
                      alignItems="stretch"
                      space={3}
                    >
                      <Text
                        style={[fonts.size_15, fonts.medium, fonts.gray800]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {name.trim()} >
                      </Text>
                      <HStack justifyContent="space-between">
                        <Text style={[fonts.size_14_150, fonts.medium, fonts.green600]}>
                          {assigneeName}
                        </Text>

                        {/*<Text style={[fonts.size_14_150, fonts.medium, fonts.right, fonts.gray500]}>*/}
                        {/*  Stage: {stage?.name ?? ''}*/}
                        {/*</Text>*/}
                      </HStack>
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
      )}
    </>
  );
}

export default PipelinesList;
