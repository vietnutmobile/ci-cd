import { Text } from '@/components/atoms';
import Button from '@/components/atoms/ButtonVariant';
import Spinner from '@/components/atoms/Spinner';
import { capitalizeFirstLetter, debounce } from '@/helpers';
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
import { Avatar, Box, FlatList, HStack, Input, VStack } from 'native-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';

function PipelinesList({ navigation }) {
  const route = useRoute();
  const navigator = useNavigator();

  const { initialStageId } = route.params;

  const { layout, gutters, fonts, colors, borders, backgrounds } = useTheme();

  const rotation = useState(new Animated.Value(0))[0];
  const [isLoading, setIsLoading] = useState(true);
  const [activeStageId, setActiveStageId] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
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
      keywords: searchKeyword,
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

  const debounceUpdateSearchKeyword = useCallback(
    debounce(async (keywords) => {
      setSearchKeyword(keywords);
    }, 400),
    [],
  );

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Box>
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
                const count = activeStageId ? nuts.length : stage?._count?.nuts ?? 0;
                const id = stage?.id ?? '';
                const name = stage?.name ?? '';

                return (
                  <Button
                    key={id}
                    type="native"
                    onPress={() => {
                      setSearchKeyword('');
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
            <Box flex={1}>
              <Box mb={2} width="100%" h={10} mt={2}>
                <Input
                  flex={1}
                  placeholder="Search nuts"
                  onChangeText={(text) => {
                    debounceUpdateSearchKeyword(text);
                  }}
                  fontSize="md"
                  bg={colors.gray100}
                  InputLeftElement={
                    <Box ml={3}>
                      <Icons.MagnifyingGlassIcon size={22} color={colors.gray400} />
                    </Box>
                  }
                />
              </Box>
              <FlatList
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
                      <Text style={[fonts.size_14_150, fonts.green600]}> Nut +</Text> button to
                      create one.
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
                        space={2}
                      >
                        <Text
                          style={[fonts.size_15, fonts.medium, fonts.gray800, layout.flex_1]}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {name.trim()}
                        </Text>

                        <HStack style={[layout.flex_1]}>
                          <Text
                            style={[fonts.size_14_150, fonts.medium, fonts.gray500, { width: 70 }]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            Contact:
                          </Text>
                          <Text
                            style={[fonts.size_14_150, fonts.medium, layout.flex_1]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {capitalizeFirstLetter(nut?.contact?.fullName) ?? ''}
                            {`<${nut?.contact?.email}>`}
                          </Text>
                        </HStack>

                        {/* <HStack>
                          <Text
                            style={[fonts.size_14_150, fonts.medium, fonts.gray500, { width: 70 }]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            Stage:
                          </Text>
                          <Text
                            style={[fonts.size_14_150, fonts.medium]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {capitalizeFirstLetter(stage?.name) ?? ''}
                          </Text>
                        </HStack> */}
                        {assignedUser ? (
                          <HStack justifyContent="space-between" alignItems="center">
                            <Text
                              style={[fonts.size_14_150, fonts.medium]}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              <Text style={[fonts.gray500]}>Assignee: </Text>{' '}
                              {capitalizeFirstLetter(assigneeName) ?? ''}
                            </Text>
                            <Avatar
                              size={6}
                              source={{ uri: assignedUser?.image }}
                              style={[gutters.marginL_8, { marginTop: 0 }]}
                            />
                          </HStack>
                        ) : null}
                      </VStack>
                    </Button>
                  );
                }}
                keyExtractor={(item, index) => item?.id ?? index.toString()}
                onEndReached={() => {
                  setPerPage(perPage + 10);
                }}
                onEndReachedThreshold={0.5}
              />
            </Box>
          )}
        </>
      )}
    </>
  );
}

export default PipelinesList;
