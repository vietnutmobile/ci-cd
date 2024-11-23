import { Button, Text } from '@/components/atoms';
import { removeQuotes } from '@/helpers';
import useNavigator from '@/helpers/hooks/use-navigation';
import {
  useConvertEmailhubToNutMutation,
  useGetOrganizationInfosQuery,
  useGetOrganizationMembersQuery,
  useGetPipelineStagesQuery,
  useGetUserProfileQuery,
} from '@/store/services';
import { useTheme } from '@/theme';
import { Box, HStack } from 'native-base';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  ArrowPathRoundedSquareIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import Modal from 'react-native-modal';
import Animated, {
  FadeIn,
  StretchInX,
  StretchOutX,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ModalSelect from './ModalSelect';

const ModalConvert = forwardRef(({ item, selectMailboxUser, callbackSuccess }, ref) => {
  const message = item?.messages?.[0] || {};
  const navigator = useNavigator();
  const [loading, setLoading] = useState(false);
  const [pipelineId, setPipelineId] = useState('');
  const [stageId, setStageId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [convert, setConvert] = useState();
  const [error, setError] = useState('');
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);
  const { colors, gutters, borders, fonts, layout } = useTheme();

  const [convertEmailhubToNut] = useConvertEmailhubToNutMutation();

  const { data: userData } = useGetUserProfileQuery();

  const orgId = userData?.orgId ?? '';
  const { data: orgMembers } = useGetOrganizationMembersQuery(
    { orgId },
    {
      skip: !orgId,
    },
  );

  const { data: stages } = useGetPipelineStagesQuery(
    { pipelineId, skipNutCount: 1 },
    { skip: !pipelineId },
  );

  const { data: organization } = useGetOrganizationInfosQuery({ orgId });
  const [showConvert, setShowConvert] = useState(false);

  const hideModalConvert = () => {
    setShowConvert(false);
    resetState();
  };

  const resetState = () => {
    // setPipelineId('');
    setAssigneeId('');
    setStageId('');
    setConvert(null);
    setError('');
    // height.value = withTiming(0);
    // opacity.value = withTiming(0);
  };

  useImperativeHandle(ref, () => ({
    showModalConvert: () => {
      resetState();
      setShowConvert(true);
    },
  }));

  useEffect(() => {
    if (error) setError('');
  }, [pipelineId, stageId, assigneeId]);

  useEffect(() => {
    if (organization?.pipeLines?.length) {
      let data = organization?.pipeLines?.[0];
      setPipelineId(data.id);
      setStageId();
      height.value = withTiming(80, { duration: 400 });
      opacity.value = withTiming(1, { duration: 400 });
    }
  }, [organization?.pipeLines]);

  const handleConvert = async () => {
    try {
      setLoading(true);
      let response = await convertEmailhubToNut({
        userId: selectMailboxUser?.id,
        threadId: item?.id,
        stageId,
        assignedUserId: assigneeId,
      });
      if (response.error) {
        return setError(response.error.data.message ?? 'Something went wrong');
      }
      setConvert(response.data);
      callbackSuccess?.();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const animated = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: opacity.value,
    };
  });

  const disabled = !pipelineId || !stageId;

  const renderSelect = () => {
    if (convert) return null;
    return (
      <>
        <Text style={[fonts.size_14, gutters.marginT_12]}>
          Pipeline<Text style={[fonts.red600]}>*</Text>
        </Text>
        <ModalSelect
          data={organization?.pipeLines}
          value={pipelineId}
          onSelect={(data) => {
            setStageId();
            setPipelineId(data.id);
            height.value = withTiming(80, { duration: 400 });
            opacity.value = withTiming(1, { duration: 400 });
          }}
          title="Select Pipeline"
          placeholder="Select an option"
        />
        <Animated.View style={[animated]}>
          <Text style={[fonts.size_14, gutters.marginT_12]}>
            Stage<Text style={[fonts.red600]}>*</Text>
          </Text>
          <ModalSelect
            data={stages}
            value={stageId}
            onSelect={(data) => setStageId(data.id)}
            title="Select Stage"
            placeholder="Job received"
          />
        </Animated.View>
        <Text style={[fonts.size_14, gutters.marginT_12]}>Assignee</Text>
        <ModalSelect
          data={orgMembers}
          onSelect={(data) => setAssigneeId(data.id)}
          title="Select Assignee"
          placeholder="Select an option"
        />

        <Button
          isLoading={loading}
          disabled={disabled}
          leftIcon={<ArrowPathRoundedSquareIcon size={18} color={colors.white} />}
          colorScheme={disabled ? 'gray' : 'green'}
          style={[borders.rounded_6, gutters.marginT_20]}
          onPress={handleConvert}
        >
          <Text style={[fonts.size_15, fonts.bold, fonts.white]}>Convert</Text>
        </Button>
      </>
    );
  };

  const renderSuccess = () => {
    if (!convert) return null;
    return (
      <>
        <Animated.View
          entering={StretchInX.duration(300)}
          exiting={StretchOutX.duration(300)}
          style={[
            borders.rounded_6,
            gutters.padding_12,
            gutters.marginT_14,
            gutters.marginB_12,
            { backgroundColor: colors.green50 },
          ]}
        >
          <HStack alignItems="center">
            <CheckBadgeIcon size={24} color={colors.green600} />
            <Text style={[fonts.size_14, fonts.green600, gutters.marginL_6]}>
              Email converted to Nut successfully
            </Text>
          </HStack>
        </Animated.View>
        <Box>
          <Button
            colorScheme="green"
            rightIcon={<ArrowRightIcon size={18} color={colors.green600} />}
            variant="ghost"
            onPress={() => {
              hideModalConvert();
              navigator.navigate('NutDetailsScreen', {
                nutId: convert.id,
              });
            }}
          >
            <Text style={[fonts.size_15, fonts.green600]}>View Nut</Text>
          </Button>
        </Box>
      </>
    );
  };

  return (
    <>
      <Modal
        isVisible={showConvert}
        onRequestClose={hideModalConvert}
        useNativeDriver
        hideModalContentWhileAnimating
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <Box bg={colors.white} style={[borders.rounded_6, gutters.padding_16]}>
          <HStack justifyContent="space-between" style={[gutters.marginB_12]}>
            <Text style={[fonts.size_16, fonts.medium]}>Convert Email to Nut</Text>
            <Button type="native" onPress={hideModalConvert}>
              <XMarkIcon size={24} color={colors.gray500} />
            </Button>
          </HStack>
          <Text>
            Convert{' '}
            <Text style={[fonts.medium, fonts.green600]}> {removeQuotes(message.subject)} </Text> to
            Nut
          </Text>
          {error ? (
            <Animated.View
              entering={FadeIn}
              style={[
                borders.rounded_6,
                gutters.padding_12,
                gutters.marginT_14,
                { backgroundColor: colors.red50 },
              ]}
            >
              <Text style={[fonts.size_14, fonts.red600]}>{error}</Text>
            </Animated.View>
          ) : null}
          {renderSelect()}
          {renderSuccess()}
        </Box>
      </Modal>
    </>
  );
});

export default ModalConvert;
