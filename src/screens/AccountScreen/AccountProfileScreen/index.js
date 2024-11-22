import { Button, Input, Text } from '@/components/atoms';
import SafeScreen from '@/components/modules/SafeScreen';
import AccountProfileScreenNavbar from '@/components/screens/AccountProfileScreen/Navbar';
import useNavigator from '@/helpers/hooks/use-navigation';
import useToast from '@/helpers/hooks/use-toast';
import { createUserProfileSchema } from '@/helpers/validation/userprofile';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '@/store/services';
import { useTheme } from '@/theme';
import defaultAvatar from '@/theme/assets/images/default-avatar.jpeg';
import { useFormik } from 'formik';
import { Avatar, Divider, HStack, ScrollView, VStack } from 'native-base';
import * as Icons from 'react-native-heroicons/outline';
import { launchImageLibrary } from 'react-native-image-picker';

function AccountProfileScreen() {
  const navigator = useNavigator();
  const toast = useToast();

  const { layout, gutters, fonts, borders, backgrounds, colors } = useTheme();

  const [updateProfile] = useUpdateUserProfileMutation();

  const { data: user } = useGetUserProfileQuery();

  const profileInitialValues = {
    userId: user?.id,
    orgId: user?.orgId,
    name: user?.name,
    email: user?.email,
    title: user?.title,
    avatar: user?.image ?? defaultAvatar,
  };

  const formik = useFormik({
    initialValues: profileInitialValues,
    enableReinitialize: true,
    validationSchema: createUserProfileSchema(),
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        await updateProfile(values).unwrap();
        toast.show({
          description: 'Profile updated successfully',
        });
        await navigator.back();
      } catch (error) {
        toast.show({
          description: error.message,
        });
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  const pickImage = async () => {
    await launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          const image = response?.assets?.[0];
          const base64Uri = `data:${image.type};base64,${image.base64}`;
          formik.setFieldValue('avatar', base64Uri);
        }
      },
    );
  };

  return (
    <SafeScreen style={[backgrounds.white, gutters.paddingB_60]}>
      <AccountProfileScreenNavbar />

      <ScrollView>
        <VStack space={3} my={4} alignItems="center">
          <Avatar
            size={24}
            source={formik.values?.avatar ? { uri: formik.values.avatar } : defaultAvatar}
          />

          <Button
            py={1.5}
            px={2}
            style={[borders._1, borders.green600, backgrounds.white]}
            leftIcon={<Icons.CloudArrowUpIcon size={15} color={colors.green600} />}
            onPress={pickImage}
          >
            <Text style={[fonts.size_14, fonts.green600]}>Choose image</Text>
          </Button>
        </VStack>

        <Divider my={0} bg="gray.200" />

        <VStack space={4} py={4}>
          <VStack flex={1} space={2}>
            <Text style={[layout.flex_2, fonts.size_14, fonts.medium, fonts.gray700]}>Name</Text>

            <Input
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.name}
              onChangeText={formik.handleChange('name')}
              onBlur={formik.handleBlur('name')}
              error={formik.touched.name && formik.errors.name}
            />
          </VStack>

          <VStack flex={1} space={2}>
            <Text style={[layout.flex_2, fonts.size_14, fonts.medium, fonts.gray700]}>Title</Text>

            <Input
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.title}
              onChangeText={formik.handleChange('title')}
              onBlur={formik.handleBlur('title')}
              error={formik.touched.title && formik.errors.title}
            />
          </VStack>

          <VStack flex={1} space={2}>
            <Text style={[layout.flex_2, fonts.size_14, fonts.medium, fonts.gray700]}>Email</Text>

            <Input
              editable={false}
              selectTextOnFocus={false}
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              error={formik.touched.email && formik.errors.email}
            />
          </VStack>
        </VStack>
      </ScrollView>

      <HStack
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        px="3"
        pt="3"
        pb="2"
        bgColor="white"
      >
        <Button
          disabled={formik.isSubmitting}
          w="100%"
          py={3}
          style={[backgrounds.green600]}
          onPress={formik.submitForm}
        >
          <Text style={[fonts.size_15, fonts.semi, fonts.white]}>Update Profile</Text>
        </Button>
      </HStack>
    </SafeScreen>
  );
}

export default AccountProfileScreen;
