import { Button, Text } from '@/components/atoms';
import SafeScreen from '@/components/modules/SafeScreen';
import NutDetailsScreenNavbar from '@/components/screens/NutDetailsScreen/Navbar';
import NutDetailsQuickAccess from '@/components/screens/NutDetailsScreen/QuickAccess';
import NutDetailsTabComments from '@/components/screens/NutDetailsScreen/TabComments';
import InputComment from '@/components/screens/NutDetailsScreen/TabComments/components/InputComment';
import NutDetailsTabContact from '@/components/screens/NutDetailsScreen/TabContact';
import NutDetailsTabDetails from '@/components/screens/NutDetailsScreen/TabDetails';
import NutDetailsTabEmails from '@/components/screens/NutDetailsScreen/TabEmails';
import NutDetailsTabFiles from '@/components/screens/NutDetailsScreen/TabFiles';
import NutDetailsTabNotes from '@/components/screens/NutDetailsScreen/TabNotes';
import { getFeaturePermissionMap, parseGlobalConfigs } from '@/helpers';
import {
  MODE_COMPOSE_NEW,
  MODE_FORWARD,
  MODE_REPLY_ALL,
  MODE_REPLY_SINGLE,
} from '@/helpers/constants';
import useNavigator from '@/helpers/hooks/use-navigation';
import {
  startEmailCompose,
  startEmailForward,
  startEmailReply,
} from '@/store/features/email-composer';
import {
  useGetGlobalConfigsQuery,
  useGetNutEmailsQuery,
  useGetOrganizationMembersQuery,
  useGetUserProfileQuery,
} from '@/store/services';
import { useTheme } from '@/theme';
import { Images } from '@/theme/ImageProvider';
import { useRoute } from '@react-navigation/native';
import { HStack, ScrollView } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';
import { useDispatch } from 'react-redux';

const getLatestIncomingEmail = (emails = []) => {
  return emails.find((email) => email?.emailCategory === 'incoming');
};

const tabs = [
  {
    id: 'details',
    name: 'Details',
    content: NutDetailsTabDetails,
  },
  {
    id: 'emails',
    name: 'Emails',
    content: NutDetailsTabEmails,
  },
  {
    id: 'notes',
    name: 'Notes',
    content: NutDetailsTabNotes,
  },
  {
    id: 'comments',
    name: 'Comments',
    content: NutDetailsTabComments,
  },
  {
    id: 'files',
    name: 'Files',
    content: NutDetailsTabFiles,
  },
  {
    id: 'contact',
    name: 'Contact',
    content: NutDetailsTabContact,
  },
];

const mapTabToFeatureId = {
  details: 'view_nut_details',
  emails: 'view_nut_emails',
  notes: 'view_nut_notes',
  comments: 'view_nut_comments',
  files: 'view_nut_files',
  contact: 'view_contact',
};

function NutDetailsScreen() {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigator();
  const { layout, gutters, fonts, colors, borders, backgrounds, dimensions, effects } = useTheme();

  const { nutId, commentId, initialTabId } = route.params;

  const [activeTabId, setActiveTabId] = useState(
    commentId ? 'comments' : initialTabId ? initialTabId : 'emails',
  );

  const { data: emails, refetch: refetchEmails } = useGetNutEmailsQuery({
    nutId,
  });
  const { data: globalConfigs } = useGetGlobalConfigsQuery(null, {
    pollingInterval: 60000,
  });

  const { data: userData } = useGetUserProfileQuery();

  const orgId = userData?.orgId ?? '';
  const { data: orgMembers } = useGetOrganizationMembersQuery(
    { orgId },
    {
      skip: !orgId,
    },
  );

  const parsedGlobalConfigs = useMemo(() => parseGlobalConfigs(globalConfigs), [globalConfigs]);

  const featurePermissions = useMemo(
    () => getFeaturePermissionMap(parsedGlobalConfigs),
    [parsedGlobalConfigs],
  );

  const latestIncomingEmail = useMemo(() => getLatestIncomingEmail(emails), [emails]);

  const tabsToShow = useMemo(() => {
    if (Object.keys(featurePermissions)?.length <= 0) {
      return [];
    }
    return tabs.filter((tab) => featurePermissions[mapTabToFeatureId[tab.id]]);
  }, [featurePermissions]);

  const TabContent = tabs.find((tab) => tab.id === activeTabId)?.content;

  useEffect(() => {
    setActiveTabId(commentId ? 'comments' : initialTabId ? initialTabId : 'emails');
  }, [route.params]);

  return (
    <SafeScreen safeAreaEdges={['top', 'bottom']} style={[backgrounds.gray50]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <NutDetailsScreenNavbar />

        <ScrollView stickyHeaderIndices={[1]} contentContainerStyle={{ flexGrow: 1 }}>
          <NutDetailsQuickAccess />

          <HStack
            space={3.5}
            alignItems="center"
            style={[
              gutters.paddingH_12,
              gutters.paddingV_6,
              borders.gray200,
              borders.roundedT_6,
              backgrounds.white,
            ]}
          >
            {tabsToShow.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <Button
                  style={
                    isActive
                      ? [gutters.paddingH_2, gutters.paddingV_6, borders.bottom_1, borders.green600]
                      : []
                  }
                  type="native"
                  key={tab.id}
                  onPress={() => setActiveTabId(tab.id)}
                  testID={`button_${tab.name}`}
                >
                  <Text
                    style={
                      isActive
                        ? [fonts.size_13, fonts.medium, fonts.green600]
                        : [fonts.size_13, fonts.semmedium, fonts.gray900]
                    }
                  >
                    {tab.name}
                  </Text>
                </Button>
              );
            })}
          </HStack>

          <View
            style={[
              gutters.paddingH_12,
              gutters.paddingV_10,
              borders.rounded_6,
              backgrounds.white,
              { flexGrow: 1 },
            ]}
          >
            <TabContent />
          </View>
        </ScrollView>

        {activeTabId === 'comments' && <InputComment />}

        {activeTabId === 'emails' && latestIncomingEmail ? (
          <>
            <View style={[dimensions.height_72]} />
            <View
              style={[
                layout.absolute,
                layout.bottom0,
                layout.left0,
                layout.right0,
                layout.row,
                layout.itemsCenter,
                layout.justifyBetween,
                gutters.padding_8,
                backgrounds.white,
              ]}
            >
              <HStack>
                <Button
                  type="native"
                  style={[layout.row, layout.itemsCenter, gutters.padding_8]}
                  onPress={() => {
                    dispatch(
                      startEmailReply({
                        email: latestIncomingEmail,
                        nutId: route.params?.nutId,
                        mode: MODE_REPLY_SINGLE,
                      }),
                    );
                    navigation.navigate('EmailReplyScreen');
                  }}
                >
                  <Images.IC_REPLY color={colors.green600} width={20} height={20} />
                  <Text
                    style={[
                      gutters.marginL_6,
                      fonts.size_14_150,
                      fonts.semi,
                      fonts.gray700,
                      fonts.green600,
                    ]}
                  >
                    Reply
                  </Text>
                </Button>

                <Button
                  type="native"
                  style={[layout.row, layout.itemsCenter, gutters.padding_8]}
                  onPress={() => {
                    dispatch(
                      startEmailReply({
                        email: latestIncomingEmail,
                        nutId: route.params?.nutId,
                        mode: MODE_REPLY_ALL,
                      }),
                    );
                    navigation.navigate('EmailReplyScreen');
                  }}
                >
                  <Images.IC_REPLY_ALL color={colors.green600} width={20} height={20} />
                  <Text
                    style={[
                      gutters.marginL_6,
                      fonts.size_14_150,
                      fonts.semi,
                      fonts.gray700,
                      fonts.green600,
                    ]}
                  >
                    Reply All
                  </Text>
                </Button>
              </HStack>

              <Button
                type="native"
                style={[layout.row, layout.itemsCenter, gutters.padding_8]}
                onPress={() => {
                  dispatch(
                    startEmailForward({
                      email: latestIncomingEmail,
                      nutId: route.params?.nutId,
                      mode: MODE_FORWARD,
                    }),
                  );
                  navigation.navigate('EmailForwardScreen');
                }}
              >
                <Text
                  style={[
                    gutters.marginR_4,
                    fonts.size_14_150,
                    fonts.semi,
                    fonts.gray700,
                    fonts.blue600,
                  ]}
                >
                  Forward
                </Text>
                <Images.IC_FORWARD color={colors.blue600} width={20} height={20} />
              </Button>
            </View>
          </>
        ) : activeTabId === 'emails' && !latestIncomingEmail ? (
          <Button
            my={2}
            style={[backgrounds.green600]}
            onPress={() => {
              dispatch(
                startEmailCompose({
                  nutId,
                  mode: MODE_COMPOSE_NEW,
                }),
              );
              navigation.navigate('EmailComposeScreen');
            }}
            leftIcon={<Icons.PencilIcon size={18} color={colors.green600} fill={colors.white} />}
            testID="button_Compose"
          >
            <Text style={[fonts.size_14, fonts.semi, fonts.white]}>Compose</Text>
          </Button>
        ) : (
          <View style={[dimensions.height_20]} />
        )}
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

export default NutDetailsScreen;
