import { Button, Input, Message, Text } from '@/components/atoms';
import SafeScreen from '@/components/modules/SafeScreen';
import ContactCreateScreenNavbar from '@/components/screens/ContactCreateScreen/Navbar';
import { MESSAGE_TYPE_ERROR, MESSAGE_TYPE_INFO } from '@/helpers/constants';
import useNavigator from '@/helpers/hooks/use-navigation';
import { createContactValidationSchema } from '@/helpers/validation/contact';
import { toFormikErrors } from '@/helpers/validation/formik';
import {
  useCreateContactMutation,
  useCreateContactTagMutation,
  useGetAllContactTagsQuery,
} from '@/store/services';
import { useTheme } from '@/theme';
import defaultAvatar from '@/theme/assets/images/default-avatar.jpeg';
import { Images } from '@/theme/ImageProvider';
import { useFormik } from 'formik';
import { Avatar, Divider, HStack, ScrollView, useToast, VStack } from 'native-base';
import { useState } from 'react';
import { View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch } from 'react-redux';

const toastErrorConfigs = {
  variant: 'subtle',
};

function ContactCreateScreen({ navigation }) {
  const dispatch = useDispatch();
  const navigator = useNavigator();
  const toast = useToast();

  const { layout, gutters, fonts, borders, backgrounds, colors, dimensions } = useTheme();

  const [message, setMessage] = useState('');
  const [tags, setTags] = useState([]);
  const [tagSearch, setTagSearch] = useState('');

  const [createContactTag, { isLoading: isTagLoading }] = useCreateContactTagMutation();
  const [createContact] = useCreateContactMutation();

  const { data: contactTags } = useGetAllContactTagsQuery({
    search: tagSearch || '',
    page: 1,
    perPage: 10,
  });

  const formik = useFormik({
    validate: async (values) => {
      try {
        const contactSchema = createContactValidationSchema({
          requireOneOf: ['email', 'phone', 'linkedin', 'facebook', 'tiktok'],
        });
        await contactSchema.validate(values, {
          abortEarly: false,
        });
      } catch (error) {
        const errors = toFormikErrors(error);
        return errors;
      }
      return {};
    },
    initialValues: {
      avatar: null,
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      phone: '',
      address: '',
      companyName: '',
      position: '',
      title: '',
      role: '',
      linkedin: '',
      facebook: '',
      tiktok: '',
    },
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        const payload = values;
        payload.tags = (tags ?? []).map((tag) => encodeURIComponent(tag.label)).join(',');
        await createContact(payload).unwrap();
        formik.resetForm();
        setTags(null);
        navigator.navigate('ContactsScreen');
      } catch (error) {
        toast.show({
          ...toastErrorConfigs,
          variant: 'subtle',
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
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          const file = response?.assets?.[0] ?? {};
          const avatarFile = {
            name: file.fileName,
            type: file.type,
            uri: file.uri,
          };
          formik.setFieldValue('avatar', avatarFile);
        }
      },
    );
  };

  return (
    <SafeScreen style={[backgrounds.white, gutters.paddingB_60]}>
      <ContactCreateScreenNavbar />

      <ScrollView>
        <VStack space={3} my={4} alignItems="center">
          <Avatar
            size={24}
            source={formik?.values?.avatar?.uri ? { uri: formik.values.avatar.uri } : defaultAvatar}
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

        {!formik?.dirty && (
          <Message
            containerStyle={[gutters.marginT_12]}
            type={MESSAGE_TYPE_INFO}
            message="At least one of the following fields must be filled: Email, Phone, Linkedin, Facebook, Tiktok"
          />
        )}

        {formik?.errors?.unnamed && formik?.dirty && (
          <Message
            type={MESSAGE_TYPE_ERROR}
            message="At least one of the following fields is required: Email, Phone, Linkedin, Facebook, Tiktok"
          />
        )}

        <Text style={[gutters.marginV_16, fonts.size_16, fonts.semi, fonts.gray900]}>
          Contact Information
        </Text>

        <HStack mb={3} space={3}>
          <VStack flex={1} space={2}>
            <Input
              label={'First Name'}
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.firstName}
              onChangeText={formik.handleChange('firstName')}
              onBlur={formik.handleBlur('firstName')}
              error={formik.touched.firstName && formik.errors.firstName}
            />
          </VStack>

          <VStack flex={1} space={2}>
            <Input
              label={'Last Name'}
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.lastName}
              onChangeText={formik.handleChange('lastName')}
              onBlur={formik.handleBlur('lastName')}
              error={formik.touched.lastName && formik.errors.lastName}
            />
          </VStack>
        </HStack>

        <HStack space={2} mb={3}>
          <VStack flex={1} space={2}>
            <Input
              label={'Email'}
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              error={formik.touched.email && formik.errors.email}
            />
          </VStack>

          <VStack flex={1} space={2}>
            <Input
              label={'Phone'}
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.phone}
              onChangeText={formik.handleChange('phone')}
              onBlur={formik.handleBlur('phone')}
              error={formik.touched.phone && formik.errors.phone}
            />
          </VStack>
        </HStack>

        <HStack space={2} mb={3}>
          <VStack flex={1} space={2}>
            <Input
              label={'Address'}
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.address}
              onChangeText={formik.handleChange('address')}
              onBlur={formik.handleBlur('address')}
              error={formik.touched.address && formik.errors.address}
            />
          </VStack>
        </HStack>

        <Divider mt={3} bg="gray.200" />

        <Text style={[gutters.marginV_16, fonts.size_16, fonts.semi, fonts.gray900]}>Career</Text>

        <HStack space={2} mb={3}>
          <VStack flex={1} space={2}>
            <Input
              label={'Company Name'}
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.companyName}
              onChangeText={formik.handleChange('companyName')}
              onBlur={formik.handleBlur('companyName')}
              error={formik.touched.companyName && formik.errors.companyName}
            />
          </VStack>

          <VStack flex={1} space={2}>
            <Input
              label={'Position'}
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.position}
              onChangeText={formik.handleChange('position')}
              onBlur={formik.handleBlur('position')}
              error={formik.touched.position && formik.errors.position}
            />
          </VStack>
        </HStack>

        <HStack space={2} mb={3}>
          <VStack flex={1} space={2}>
            <Input
              label={'Title'}
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.title}
              onChangeText={formik.handleChange('title')}
              onBlur={formik.handleBlur('title')}
              error={formik.touched.title && formik.errors.title}
            />
          </VStack>

          <VStack flex={1} space={2}>
            <Input
              label={'Role'}
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.role}
              onChangeText={formik.handleChange('role')}
              onBlur={formik.handleBlur('role')}
              error={formik.touched.role && formik.errors.role}
            />
          </VStack>
        </HStack>

        <Divider mt={3} bg="gray.200" />

        <Text style={[gutters.marginV_16, fonts.size_16, fonts.semi, fonts.gray900]}>
          Social Links
        </Text>

        <HStack space={2} mb={3}>
          <VStack flex={1} space={2}>
            <Text style={[layout.flex_2, fonts.size_14, fonts.medium, fonts.gray700]}>
              Linkedin
            </Text>

            <Input
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.linkedin}
              onChangeText={formik.handleChange('linkedin')}
              onBlur={formik.handleBlur('linkedin')}
              error={formik.touched.linkedin && formik.errors.linkedin}
            />
          </VStack>

          <VStack flex={1} space={2}>
            <Text style={[layout.flex_2, fonts.size_14, fonts.medium, fonts.gray700]}>
              Facebook
            </Text>

            <Input
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.facebook}
              onChangeText={formik.handleChange('facebook')}
              onBlur={formik.handleBlur('facebook')}
              error={formik.touched.facebook && formik.errors.facebook}
            />
          </VStack>
        </HStack>

        <HStack space={2} mb={3}>
          <VStack flex={1} space={2}>
            <Text style={[layout.flex_2, fonts.size_14, fonts.medium, fonts.gray700]}>Tiktok</Text>

            <Input
              style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
              innerStyle={[fonts.size_14, fonts.gray900]}
              value={formik.values.tiktok}
              onChangeText={formik.handleChange('tiktok')}
              onBlur={formik.handleBlur('tiktok')}
              error={formik.touched.tiktok && formik.errors.tiktok}
            />
          </VStack>
          <VStack flex={1} />
        </HStack>
      </ScrollView>

      {/*<View position="absolute" bottom="0" left="0" right="0" px="3" pt="3" pb="2" bgColor="white">*/}
      <View
        style={[
          layout.absolute,
          layout.bottom0,
          layout.left0,
          layout.right0,
          layout.row,
          gutters.paddingH_12,
          gutters.paddingV_8,
          borders.rounded_4,
          backgrounds.white,
        ]}
      >
        <Button
          disabled={formik.isSubmitting}
          w="100%"
          py={3}
          style={[backgrounds.green600]}
          onPress={() => formik.submitForm()}
          leftIcon={
            formik.isSubmitting ? (
              <Images.IC_SPINNER
                width={15}
                height={15}
                color={colors.green600}
                fill={colors.white}
              />
            ) : (
              <></>
            )
          }
        >
          <Text style={[fonts.size_15, fonts.semi, fonts.white]}>Create</Text>
        </Button>
      </View>
    </SafeScreen>
  );
}

export default ContactCreateScreen;
