import { Button, Text } from '@/components/atoms';
import { useConfirmDialog } from '@/components/hooks';
import { formatEmailDate, htmlToPlainText, processEmailSender } from '@/helpers';
import { MODE_COMPOSE_NEW } from '@/helpers/constants';
import useNavigator from '@/helpers/hooks/use-navigation';
import { startEmailCompose } from '@/store/features/email-composer';
import {
  useGetNutByIdQuery,
  useGetNutEmailsQuery,
  useGetNutWorkspaceEmailsQuery,
} from '@/store/services';
import { useTheme } from '@/theme';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { HStack, VStack } from 'native-base';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';
import { useDispatch } from 'react-redux';
import truncate from 'truncate-html';

const NO_CONTACT_ERROR = 'NO_CONTACT_ERROR';
const NO_CONTAT_EMAIL_ERROR = 'NO_CONTAT_EMAIL_ERROR';

function EmailItem({ index, nutId, data }) {
  const navigation = useNavigator();

  const { layout, fonts, colors, borders, backgrounds, dimensions } = useTheme();

  const { name, email } = processEmailSender(data?.sender);

  const id = data?.id ?? '';

  const date = formatEmailDate(data?.date ?? new Date());

  const subject = truncate(data?.subject ?? '', {
    length: 80,
    stripTags: true,
  });

  const messageBodyText = truncate(
    data?.messageBody ?? htmlToPlainText(data?.messageBodyHtml ?? ''),
    {
      length: 80,
      stripTags: true,
    },
  );

  return (
    <Button
      type="native"
      onPress={() => {
        navigation.navigate('EmailDetailsScreen', {
          email: data,
          nutId,
        });
      }}
    >
      <HStack
        mb={2}
        py={3}
        space={2.5}
        key={id}
        style={[borders.gray100, ...(index > 0 ? [borders.top_1] : [])]}
      >
        <View
          style={[
            dimensions.width_28,
            dimensions.height_28,
            layout.itemsCenter,
            layout.justifyCenter,
            borders.roundedFull,
            backgrounds.gray200,
          ]}
        >
          <Icons.UserCircleIcon size={20} color={colors.gray900} />
        </View>

        <View style={[layout.flex_1]}>
          <HStack justifyContent="space-between" space={2} mb={2}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[layout.flex_1, fonts.size_14_150, fonts.medium, fonts.gray900]}
            >
              {`${name} <${email}>`}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={[fonts.size_12_150, fonts.blue600]}>
              {date}
            </Text>
          </HStack>

          <VStack space={2}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={[fonts.size_14_150, fonts.gray800]}>
              {subject.trim()}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={[fonts.size_14_150, fonts.gray600]}>
              {messageBodyText.trim()}
            </Text>
          </VStack>
        </View>
      </HStack>
    </Button>
  );
}

function NutDetailsTabEmails() {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigator();

  const { confirm: confirmContactAction, renderDialog } = useConfirmDialog({
    mainCta: 'Yes',
    secondaryCta: 'No',
  });

  const [alertContent, setAlertContent] = useState({
    title: '',
    description: '',
  });

  const { layout, fonts, colors, borders, backgrounds, gutters, dimensions } = useTheme();

  const { nutId } = route.params;

  const { data: nut } = useGetNutByIdQuery({ id: nutId, include: 'contact' }, { skip: !nutId });

  const { data: emails, refetch: refetchEmails } = useGetNutEmailsQuery(
    {
      nutId,
    },
    {
      skip: !nutId,
    },
  );

  const { data: workspaceEmails } = useGetNutWorkspaceEmailsQuery({ nutId }, { skip: !nutId });

  const checkValidContact = async (contact = {}) => {
    if (Object.keys(contact)?.length <= 0) {
      setAlertContent({
        title: 'No contact found',
        description:
          'This nut does not have any contact associated with it. Do you want to link contact now?',
      });
      return {
        isValid: false,
        error: NO_CONTACT_ERROR,
      };
    }

    const contactEmail = contact?.email ?? '';

    if (contactEmail?.length <= 0) {
      setAlertContent({
        title: 'No contact email found',
        description: 'Do you want to update email for associated contact?',
      });
      return {
        isValid: false,
        error: NO_CONTAT_EMAIL_ERROR,
      };
    }

    setAlertContent({
      title: '',
      description: '',
    });

    return {
      isValid: true,
    };
  };

  const renderEmail = useCallback(
    ({ item, index }) => <EmailItem index={index} nutId={nutId} data={item} />,
    [emails],
  );

  // const composeEmail = async () => {
  //   const result = await checkValidContact(nut?.contact ?? {});

  //   const { isValid, error } = result;

  //   if (isValid) {
  //     dispatch(
  //       startEmailCompose({
  //         nutId,
  //         mode: MODE_COMPOSE_NEW,
  //       }),
  //     );
  //     navigation.navigate('EmailComposeScreen');
  //     return;
  //   }

  //   if (error === NO_CONTACT_ERROR && (await confirmContactAction())) {
  //     navigation.navigate('NutDetailsScreen', {
  //       initialTabId: 'contact',
  //       nutId,
  //     });
  //   } else if (error === NO_CONTAT_EMAIL_ERROR && (await confirmContactAction())) {
  //     navigation.navigate('ContactEditScreen', {
  //       contact: nut?.contact,
  //     });
  //   }
  // };

  useFocusEffect(
    useCallback(() => {
      refetchEmails();
    }, [refetchEmails]),
  );

  return (
    <>
      {/* {!emails?.length && (
        <View style={[gutters.marginBottom_18]}>
          <Button
            width="130"
            style={[backgrounds.green600]}
            onPress={composeEmail}
            leftIcon={
              <Icons.PencilIcon
                width={16}
                height={16}
                color={colors.green600}
                fill={colors.white}
              />
            }
          >
            <Text style={[fonts.size_14, fonts.semi, fonts.white]}>Compose</Text>
          </Button>
        </View>
      )} */}
      {(emails || []).map((email) => (
        <EmailItem key={email.id} index={0} nutId={nutId} data={email} />
      ))}

      {renderDialog({
        ...alertContent,
        mainCta: 'Yes',
        secondaryCta: 'No',
      })}
    </>
  );
}

export default NutDetailsTabEmails;
