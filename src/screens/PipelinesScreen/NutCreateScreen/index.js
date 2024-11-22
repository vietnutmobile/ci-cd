import { Button, Input, Select, Text, Textarea } from '@/components/atoms';
import SafeScreen from '@/components/modules/SafeScreen';
import NutCreateScreenNavbar from '@/components/screens/NutCreateScreen/Navbar';
import { debounce, isNullOrUndefined } from '@/helpers';
import { extractContactDisplayName, getUserNameFromEmail } from '@/helpers/content';
import useNavigator from '@/helpers/hooks/use-navigation';
import useToast from '@/helpers/hooks/use-toast';
import { createNutValidationSchema } from '@/helpers/validation';
import {
  useCreateNutMutation,
  useGetContactsQuery,
  useGetOrganizationMembersQuery,
  useGetPipelineStagesQuery,
  useGetUserProfileQuery,
} from '@/store/services';
import { useTheme } from '@/theme';
import defaultAvatar from '@/theme/assets/images/default-avatar.jpeg';
import { Images } from '@/theme/ImageProvider';
import { useRoute } from '@react-navigation/native';
import { useFormik } from 'formik';
import { Avatar, HStack, ScrollView, VStack } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import * as Icons from 'react-native-heroicons/outline';
import { useDispatch } from 'react-redux';

function NutCreateScreen({ navigation }) {
  const dispatch = useDispatch();
  const navigator = useNavigator();
  const toast = useToast();
  const route = useRoute();

  const { pipeline } = route.params ?? {};

  const pipelineId = pipeline?.id ?? '';

  const { layout, gutters, fonts, borders, backgrounds, colors, dimensions, effects } = useTheme();

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

  const assigneeOptions =
    (orgMembers ?? []).map((member) => ({
      id: member?.id,
      value: member?.id,
      label: member?.name || getUserNameFromEmail(member?.email),
    })) ?? [];

  const stageOptions = (stages ?? []).map((stage) => ({
    key: stage?.id,
    value: stage?.id ?? '',
    label: stage?.name ?? '',
  }));

  const [debounceContactKeywords, setDebounceContactKeywords] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  const [createNut] = useCreateNutMutation();

  const { data: contactResponse, isLoading } = useGetContactsQuery(
    {
      keywords: debounceContactKeywords || '',
    },
    {
      skip: !debounceContactKeywords,
    },
  );

  const contacts = contactResponse?.data ?? [];

  const debounceUpdateContactKeywords = useCallback(
    debounce(async (keywords) => {
      setDebounceContactKeywords(keywords);
    }, 200),
    [],
  );

  const renderItem = (item) => {
    return (
      <View style={[gutters.padding_10]}>
        <Text style={[fonts.size_13, fonts.gray900]}>{item.label}</Text>
      </View>
    );
  };

  const renderSelectedItem = (item) => {
    return (
      <HStack alignItems="center" style={[gutters.paddingH_12, gutters.paddingV_10]}>
        <Icons.CheckIcon size={13} color={colors.green600} />
        <Text style={[fonts.size_14, fonts.gray900]}>{item.label}</Text>
      </HStack>
    );
  };

  const formik = useFormik({
    validationSchema: createNutValidationSchema(),
    initialValues: {
      contactId: '',
      name: '',
      leadSource: '',
      pipelineId: '',
      stageId: '',
      assignedUserId: '',
      notes: '',
    },
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        await createNut(values).unwrap();
        formik.resetForm();
        setSelectedContact(null);
        toast.show({
          description: 'Nut created successfully',
          status: 'success',
        });
        navigator.navigate('PipelineDetailsScreen', {
          initialStageId: values?.stageId ?? '',
          pipeline,
        });
      } catch (error) {
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (formik?.values?.contactId) {
      setSelectedContact(contacts.find((contact) => contact?.id === formik?.values?.contactId));
    }
  }, [formik?.values?.contactId]);

  return (
    <SafeScreen style={[backgrounds.gray100]}>
      <NutCreateScreenNavbar />

      <ScrollView>
        <View
          style={[gutters.marginT_12, gutters.padding_12, borders.rounded_8, backgrounds.white]}
        >
          <HStack
            space={2}
            alignItems="center"
            style={[gutters.marginB_12, gutters.paddingB_12, borders.bottom_1, borders.gray200]}
          >
            <Icons.IdentificationIcon size={18} color={colors.green600} />
            <Text style={[fonts.size_14, fonts.semi, fonts.green600]}>Details</Text>
          </HStack>

          <VStack space={3}>
            <HStack space={3}>
              <View style={[layout.flex_1]}>
                <Input
                  required
                  label={'Name'}
                  name="name"
                  style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
                  innerStyle={[fonts.size_14, fonts.gray900]}
                  value={formik.values.name}
                  onChangeText={formik.handleChange('name')}
                  onBlur={formik.handleBlur('name')}
                  error={formik.touched.name && formik.errors.name}
                />
              </View>

              <View style={[layout.flex_1]}>
                <Input
                  required
                  label={'Lead Source'}
                  name="leadSource"
                  style={[gutters.paddingH_12, gutters.paddingV_8, borders.rounded_4]}
                  innerStyle={[fonts.size_14, fonts.gray900]}
                  value={formik.values.leadSource}
                  onChangeText={formik.handleChange('leadSource')}
                  onBlur={formik.handleBlur('leadSource')}
                  error={formik.touched.leadSource && formik.errors.leadSource}
                />
              </View>
            </HStack>

            <HStack space={3}>
              <View style={[layout.flex_1]}>
                <Select
                  required
                  dropdownIcon={
                    <Icons.ChevronDownIcon
                      style={[gutters.paddingH_12]}
                      size={14}
                      color={colors.gray700}
                    />
                  }
                  items={assigneeOptions}
                  placeholder="Select Assignee"
                  label="Assignee"
                  name="assignedUserId"
                  selectedValue={formik.values.assignedUserId}
                  error={formik.touched?.assignedUserId && formik.errors?.assignedUserId}
                  onChange={(value) => {
                    formik.setFieldValue('assignedUserId', value);
                  }}
                  onBlur={() => formik.handleBlur('assignedUserId')}
                />
              </View>

              <View style={[layout.flex_1]}>
                <Select
                  required
                  dropdownIcon={
                    <Icons.ChevronDownIcon
                      style={[gutters.paddingH_12]}
                      size={14}
                      color={colors.gray700}
                    />
                  }
                  items={stageOptions}
                  placeholder="Select Stage"
                  label="Stages"
                  name="stageId"
                  selectedValue={formik.values.stageId}
                  error={formik.touched?.stageId && formik.errors?.stageId}
                  onChange={(value) => {
                    formik.setFieldValue('stageId', value);
                  }}
                  onBlur={() => formik.handleBlur('stageId')}
                />
              </View>
            </HStack>

            <View style={[layout.flex_1]}>
              <Text
                style={[
                  gutters.marginB_6,
                  layout.flex_2,
                  fonts.size_14,
                  fonts.medium,
                  fonts.gray700,
                ]}
              >
                Notes
              </Text>

              <Textarea
                h={16}
                w="100%"
                disabled={formik.isSubmitting}
                placeholder="Personal notes"
                name="notes"
                value={formik.values.notes}
                onChangeText={formik.handleChange('notes')}
                onBlur={formik.handleBlur('notes')}
                error={formik.touched.notes && formik.errors.notes}
              />
            </View>
          </VStack>
        </View>

        <View
          style={[
            layout.flex_1,
            layout.justifyStart,
            gutters.marginT_12,
            gutters.padding_12,
            borders.rounded_8,
            backgrounds.white,
            {
              justifyItems: 'flex-start',
            },
          ]}
        >
          <HStack
            space={2}
            alignItems="center"
            style={[gutters.marginB_12, gutters.paddingB_12, borders.bottom_1, borders.gray200]}
          >
            <Icons.UserIcon size={18} color={colors.green600} />
            <Text style={[fonts.size_14, fonts.semi, fonts.green600]}>Contact</Text>
          </HStack>

          <Dropdown
            search
            mode="modal"
            style={[
              dimensions.height_36,
              gutters.paddingH_12,
              borders._1,
              borders.gray300,
              borders.rounded_4,
              backgrounds.white,
            ]}
            placeholderStyle={[fonts.interRegular, fonts.size_14, fonts.gray900]}
            containerStyle={[gutters.padding_8, borders.rounded_4]}
            itemContainerStyle={[gutters.marginH_6, borders.rounded_4]}
            selectedTextStyle={[fonts.interRegular, fonts.size_14, fonts.gray900]}
            searchPlaceholder="Search contact by phone, email, name..."
            onChangeText={(text) => {
              debounceUpdateContactKeywords(text);
            }}
            inputSearchStyle={[
              gutters.paddingV_0,
              dimensions.height_34,
              fonts.interRegular,
              fonts.size_14,
              fonts.gray700,
              borders.rounded_4,
            ]}
            labelField="label"
            valueField="value"
            renderItem={renderItem}
            renderSelectedItem={renderSelectedItem}
            data={contacts.map((contact) => {
              const displayName = extractContactDisplayName(contact);
              const phone = contact?.phone ?? '';
              const email = contact?.email ?? '';
              const label = `${displayName}${email ? ` - ${email}` : ''}${phone ? ` - ${phone}` : ''}`;
              return {
                key: contact?.id,
                value: contact?.id,
                label: label,
              };
            })}
            renderLeftIcon={() => (
              <Icons.LinkIcon style={[gutters.marginR_8]} size={15} color={colors.gray900} />
            )}
            value={'Search and link contact'}
            placeholder={'Search and link contact'}
            onFocus={() => formik.setFieldTouched('contactId')}
            onBlur={() => formik.handleBlur('contactId')}
            onChange={(item) => {
              formik.setFieldValue('contactId', item.value);
            }}
          />

          {!isNullOrUndefined(selectedContact) && Object.keys(selectedContact)?.length > 0 && (
            <HStack py={3} justifyContent="flex-start" alignItems="center" space={2}>
              <Avatar
                size={8}
                source={
                  formik?.values?.avatar?.uri ? { uri: formik.values.avatar.uri } : defaultAvatar
                }
              />

              <Text style={[layout.flex_1, fonts.size_14, fonts.gray900]}>
                {extractContactDisplayName(selectedContact)}
              </Text>

              <Button size={6} style={[borders.none]} backgroundColor="green600" onPress={() => {}}>
                <Icons.PencilIcon size={15} color={colors.white} />
              </Button>

              <Button
                size={6}
                style={[borders._1, borders.red600]}
                backgroundColor="white"
                onPress={async () => {
                  setSelectedContact(null);
                  await formik.setFieldValue('contactId', '');
                  await formik.submitForm();
                }}
              >
                <Icons.TrashIcon size={15} color={colors.red600} />
              </Button>
            </HStack>
          )}
        </View>

        <HStack py={3} space={2} justifyContent="space-between" alignItems="center">
          <Button
            disabled={formik.isSubmitting}
            px={3}
            py={2.5}
            width={'100%'}
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
        </HStack>
      </ScrollView>
    </SafeScreen>
  );
}

export default NutCreateScreen;
