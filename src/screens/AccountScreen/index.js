import { Button, Image, Input, Text } from '@/components/atoms';
import { useConfirmDialog } from '@/components/hooks';
import SafeScreen from '@/components/modules/SafeScreen';
import { GoogleSignIn } from '@/helpers/authentication/google-signin';
import { getUserNameFromEmail } from '@/helpers/content';
import useNavigator from '@/helpers/hooks/use-navigation';
import { logoutUser } from '@/store/features/authentication';
import {
  rootApi,
  useChangeUserOnlineStatusMutation,
  useDeleteOrganizationMutation,
  useGetUserProfileQuery,
} from '@/store/services';
import { useTheme } from '@/theme';
import defaultAvatar from '@/theme/assets/images/default-avatar.jpeg';
import { Images } from '@/theme/ImageProvider';
import { useFormik } from 'formik';
import { AlertDialog, Avatar, FlatList, HStack } from 'native-base';
import React, { useState } from 'react';
import { View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

function AccountScreen() {
  const navigator = useNavigator();
  const dispatch = useDispatch();

  const { confirm: confirmLogout, renderDialog } = useConfirmDialog({
    mainCta: 'Yes',
    secondaryCta: 'No',
  });

  const { layout, fonts, borders, gutters, backgrounds, dimensions, colors } = useTheme();

  const { data: user } = useGetUserProfileQuery();
  const [changeUserOnlineStatus] = useChangeUserOnlineStatusMutation();
  const [deleteOrganization] = useDeleteOrganizationMutation();
  const [shouldShowModalDeleteAccount, setShouldShowModalDeleteAccount] = useState(false);

  const isAdmin = user?.role === 'admin';

  const userName = user?.name ?? getUserNameFromEmail(user?.email ?? '') ?? '';
  const isOnline = user?.online ?? false;

  const renderMenuItem = ({ item }) => {
    const ContentLeft = item.contentLeft;
    const ContentRight = item.contentRight;
    const onPress = item.onPress ?? undefined;

    return (
      <Button
        type="native"
        key={item.id}
        style={[
          layout.row,
          layout.justifyBetween,
          layout.itemsCenter,
          gutters.paddingV_18,
          borders.bottom_1,
          borders.gray200,
        ]}
        onPress={onPress}
      >
        <ContentLeft />
        <ContentRight />
      </Button>
    );
  };

  const handleLogout = async ({ needConfirm = true } = {}) => {
    const shouldLogout = needConfirm ? await confirmLogout() : true;

    if (shouldLogout) {
      await dispatch(logoutUser());
      await GoogleSignIn.signOut();
      await dispatch(rootApi.util.resetApiState());
    }
  };

  const menuItems = [
    {
      id: 1,
      contentLeft: () => (
        <HStack space={2} alignItems={'center'}>
          <Text style={[fonts.size_16, fonts.gray900]}>Change status</Text>
          <Icons.ChevronRightIcon size={14} color={colors.gray900} />
        </HStack>
      ),
      contentRight: () => (
        <HStack space={1} alignItems={'center'}>
          <Text
            style={[
              fonts.size_16,
              fonts.gray900,
              ...(isOnline ? [fonts.green600] : [fonts.gray500]),
            ]}
          >
            {isOnline ? `Online` : 'Offline'}
          </Text>

          <Text style={[fonts.size_16, fonts.gray900, ...(isOnline ? [fonts.green600] : [])]}>
            •
          </Text>
        </HStack>
      ),
      onPress: async () => {
        await changeUserOnlineStatus({ userId: user?.id, isOnline: !isOnline }).unwrap();
      },
    },
    ...(isAdmin
      ? [
          {
            id: 2,
            contentLeft: () => (
              <Text style={[fonts.size_16, fonts.gray900, fonts.red600]}>Delete Account</Text>
            ),
            contentRight: () => <Icons.TrashIcon size={20} color={colors.red600} />,
            onPress: async () => {
              setShouldShowModalDeleteAccount(true);
            },
          },
        ]
      : []),
    {
      id: 3,
      contentLeft: () => <Text style={[fonts.size_16, fonts.gray900]}>Logout</Text>,
      contentRight: () => <Icons.ArrowRightStartOnRectangleIcon size={20} color={colors.gray900} />,
      onPress: handleLogout,
    },
  ];

  const formik = useFormik({
    validationSchema: Yup.object().shape({
      confirmation: Yup.string().oneOf(['DELETE'], '').required('Confirmation is required.'),
    }),
    initialValues: {
      confirmation: '',
    },
    onSubmit: async (values) => {
      formik.setSubmitting(true);

      try {
        if (values.confirmation === 'DELETE' && user?.orgId) {
          await deleteOrganization({ orgId: user.orgId }).unwrap();
          formik.setSubmitting(false);
          await handleLogout({
            needConfirm: false,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  return (
    <SafeScreen safeAreaBottom={false} style={[gutters.paddingH_0]}>
      <Image
        alt={''}
        source={Images.PROFILE_BG}
        style={[dimensions.windowWidth, dimensions.height_160]}
      />

      <View style={[layout.column, layout.justifyCenter, layout.itemsCenter, gutters.paddingH_14]}>
        <Avatar mt={-12} size={24} source={user?.image ? { uri: user?.image } : defaultAvatar} />
      </View>

      <HStack
        mb={2}
        style={[gutters.paddingH_14]}
        justifyContent="center"
        alignItems="center"
        space={2}
      >
        <Text style={[gutters.marginV_18, fonts.size_18, fonts.semi, fonts.gray900]}>
          {userName}
        </Text>

        <Button
          py={1}
          px={1}
          style={[borders._1, borders.green600, backgrounds.white]}
          leftIcon={<Icons.PencilIcon size={15} color={colors.green600} />}
          onPress={() => navigator.navigate('AccountProfileScreen')}
        />
      </HStack>

      <FlatList
        style={[gutters.paddingH_14]}
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
      />

      {renderDialog({
        title: 'Logout',
        description: 'You want to logout?',
        mainCta: 'Yes',
        secondaryCta: 'No',
      })}

      <AlertDialog
        leastDestructiveRef={React.createRef()}
        isOpen={shouldShowModalDeleteAccount}
        onClose={() => {
          setShouldShowModalDeleteAccount(false);
        }}
      >
        <AlertDialog.Content>
          <AlertDialog.Header
            px={4}
            py={3}
            gap={2}
            flexDirection="row"
            justifyContent="start"
            alignItems="center"
          >
            <Icons.TrashIcon size={20} color={colors.red600} />
            <Text style={[fonts.size_14, fonts.medium, fonts.red600]}>Delete Account</Text>
          </AlertDialog.Header>

          <AlertDialog.Body px={4} py={4}>
            <Text style={[fonts.size_14, fonts.line_20, fonts.gray800]}>
              This action{' '}
              <Text style={[fonts.size_14, fonts.line_20, fonts.gray800, fonts.semi]}>
                can not be undone
              </Text>
              . This will permanently delete your account and all organization's data.
            </Text>

            <Text style={[gutters.marginT_12, fonts.size_13, fonts.line_20, fonts.gray800]}>
              Please type{' '}
              <Text style={[fonts.size_13, fonts.line_20, fonts.gray800, fonts.semi]}>DELETE</Text>{' '}
              to confirm.
            </Text>

            <Input
              style={[
                gutters.marginT_12,
                gutters.paddingH_12,
                gutters.paddingV_8,
                borders.rounded_4,
              ]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.confirmation}
              onChangeText={formik.handleChange('confirmation')}
              onBlur={formik.handleBlur('confirmation')}
            />
          </AlertDialog.Body>

          <AlertDialog.Footer px={4} py={2}>
            <HStack justifyContent="end" alignItems="center" space={2}>
              <Button
                py={1.5}
                variant="unstyled"
                onPress={() => {
                  setShouldShowModalDeleteAccount(false);
                }}
              >
                <Text style={[fonts.size_14, fonts.semi, fonts.line_18, fonts.gray700]}>
                  Cancel
                </Text>
              </Button>

              <Button
                disabled={formik.isSubmitting}
                py={1.5}
                style={[backgrounds.red500]}
                onPress={() => formik.handleSubmit()}
                leftIcon={
                  formik.isSubmitting && (
                    <Images.IC_SPINNER
                      width={15}
                      height={15}
                      color={colors.white}
                      fill={colors.white}
                    />
                  )
                }
              >
                <Text style={[fonts.size_14, fonts.semi, fonts.white]}>Confirm</Text>
              </Button>
            </HStack>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </SafeScreen>
  );
}

export default AccountScreen;
