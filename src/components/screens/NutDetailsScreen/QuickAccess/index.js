import useNavigator from '@/helpers/hooks/use-navigation';
import useToast from '@/helpers/hooks/use-toast';
import { useGetNutByIdQuery } from '@/store/services';
import { useTheme } from '@/theme';
import { useRoute } from '@react-navigation/native';
import { HStack } from 'native-base';
import { useRef } from 'react';
import sendEmail from 'react-native-email';
import makeCall from 'react-native-phone-call';
import { Text } from '../../../atoms';

const toastErrorConfigs = {
  variant: 'subtle',
};

function NutDetailsQuickAccess() {
  const route = useRoute();
  const toast = useToast();
  const navigator = useNavigator();
  const cancelRef = useRef(null);

  const { layout, gutters, fonts, colors, borders, effects, backgrounds, dimensions } = useTheme();

  const nutId = route.params?.nutId ?? '';

  const { data: nut } = useGetNutByIdQuery(
    {
      id: nutId,
    },
    {
      skip: !nutId,
    },
  );

  const contact = nut?.contact ?? {};
  const stage = nut?.stage?.name ?? '';
  const contactPhone = contact?.phone ?? '';
  const contactEmail = contact?.email ?? '';

  const emailTo = (to) => {
    sendEmail([to]).catch((error) => {
      toast.show({
        description: error?.message ?? 'Error trigger send mail.',
      });
    });
  };

  const phoneTo = (to) => {
    makeCall({ number: to, prompt: true }).catch((error) => {
      toast.show({
        description: error?.message ?? 'Error making call.',
      });
    });
  };

  return (
    <HStack
      py={2}
      space={2}
      alignItems="center"
      justifyContent="space-between"
      style={[gutters.marginB_8, gutters.paddingB_12, borders.bottom_1, borders.gray200]}
    >
      {/*<HStack space={3}>*/}
      {/*<Button*/}
      {/*  disabled={!contactPhone}*/}
      {/*  py={1.5}*/}
      {/*  px={1.5}*/}
      {/*  style={[borders._1, borders.green600, borders.roundedFull, backgrounds.transparent]}*/}
      {/*  onPress={() => {*/}
      {/*    if (contactPhone) {*/}
      {/*      phoneTo(contactPhone);*/}
      {/*    } else {*/}
      {/*      toast.show({*/}
      {/*        description: 'Associated contact with phone number to enable this feature.',*/}
      {/*      });*/}
      {/*    }*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Icons.PhoneIcon size={15} color={colors.green600} />*/}
      {/*</Button>*/}

      {/*<Button*/}
      {/*  disabled={!contactEmail}*/}
      {/*  py={1.5}*/}
      {/*  px={1.5}*/}
      {/*  style={[borders._1, borders.green600, borders.roundedFull, backgrounds.transparent]}*/}
      {/*  onPress={() => {*/}
      {/*    if (contactEmail) {*/}
      {/*      emailTo(contactEmail);*/}
      {/*    } else {*/}
      {/*      toast.show({*/}
      {/*        description: 'Associated contact with email to enable this feature.',*/}
      {/*      });*/}
      {/*    }*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Icons.EnvelopeIcon size={15} color={colors.green600} />*/}
      {/*</Button>*/}
      {/*</HStack>*/}

      {/*{stage && (*/}
      {/*  <View*/}
      {/*    style={[*/}
      {/*      gutters.paddingH_8,*/}
      {/*      gutters.paddingV_4,*/}
      {/*      backgrounds.green600,*/}
      {/*      borders._1,*/}
      {/*      borders.green600,*/}
      {/*      borders.rounded_4,*/}
      {/*    ]}*/}
      {/*  >*/}
      {/*    <Text style={[fonts.white]}>Stage: {stage}</Text>*/}
      {/*  </View>*/}
      {/*)}*/}

      {stage && (
        <HStack space={1}>
          <Text style={[fonts.size_14, fonts.gray800]}>Stage:</Text>
          <Text style={[fonts.size_15, fonts.green600, fonts.semi]}>{stage}</Text>
        </HStack>
      )}
    </HStack>
  );
}

export default NutDetailsQuickAccess;
