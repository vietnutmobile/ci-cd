import { Text } from '@/components/atoms';
import { debounce, isNullOrUndefined } from '@/helpers';
import { toastErrorConfigs } from '@/helpers/constants';
import { extractContactDisplayName } from '@/helpers/content';
import useNavigator from '@/helpers/hooks/use-navigation';
import useToast from '@/helpers/hooks/use-toast';
import { createNutValidationSchema } from '@/helpers/validation/nut';
import {
  useGetContactsQuery,
  useGetNutByIdQuery,
  useGetUserProfileQuery,
  useUpdateNutMutation,
} from '@/store/services';
import { useTheme } from '@/theme';
import defaultAvatar from '@/theme/assets/images/default-avatar.jpeg';
import { useRoute } from '@react-navigation/native';
import { useFormik } from 'formik';
import { Avatar, HStack } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import * as Icons from 'react-native-heroicons/outline';
import Button from '../../../atoms/ButtonVariant';

function NutDetailsTabContact() {
  const route = useRoute();
  const toast = useToast();
  const navigator = useNavigator();

  const { layout, gutters, fonts, colors, borders, effects, backgrounds, dimensions } = useTheme();

  const { nutId } = route.params;

  const [debounceContactKeywords, setDebounceContactKeywords] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  const { data: userData } = useGetUserProfileQuery();

  const { data: contactResponse } = useGetContactsQuery(
    {
      keywords: debounceContactKeywords || '',
    },
    {
      skip: !debounceContactKeywords,
    },
  );

  const { data: nut } = useGetNutByIdQuery({ id: nutId, include: 'contact' }, { skip: !nutId });

  const [updateNut] = useUpdateNutMutation();

  const contacts = contactResponse?.data ?? [];

  const formik = useFormik({
    validationSchema: createNutValidationSchema(),
    enableReinitialize: true,
    initialValues: {
      contactId: nut?.contactId ?? '',
      name: nut?.name ?? '',
      leadSource: nut?.leadSource ?? '',
      stageId: nut?.stageId ?? '',
      assignedUserId: nut?.assignedUserId ?? '',
    },
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        await updateNut({
          ...values,
          id: nutId,
        }).unwrap();
        toast.show({
          description: 'Nut updated successfully.',
        });
      } catch (error) {
        toast.show({
          ...toastErrorConfigs,
          description: error.message,
        });
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  const renderItem = (item) => {
    return (
      <View style={[gutters.paddingH_12, gutters.paddingV_10]}>
        <Text style={[fonts.size_14, fonts.gray900]}>{item.label}</Text>
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

  const debounceUpdateContactKeywords = useCallback(
    debounce(async (keywords) => {
      setDebounceContactKeywords(keywords);
    }, 200),
    [],
  );

  useEffect(() => {
    if (formik?.values?.contactId) {
      const nutContact = nut?.contact ?? {};
      const foundContact = contacts.find((contact) => contact?.id === formik?.values?.contactId);

      if (foundContact) {
        setSelectedContact(foundContact);
      } else {
        setSelectedContact(nutContact);
      }
    }
  }, [formik?.values?.contactId]);

  useEffect(() => {
    setSelectedContact(nut?.contact ?? {});
  }, [nut?.contactId]);

  return (
    <View>
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
        data={contacts.map((contact) => ({
          key: contact?.id,
          value: contact?.id,
          label: extractContactDisplayName(contact),
        }))}
        renderLeftIcon={() => (
          <Icons.LinkIcon style={[gutters.marginR_8]} size={15} color={colors.gray900} />
        )}
        value={'Search and link contact'}
        placeholder={'Search and link contact'}
        onFocus={() => formik.setFieldTouched('contactId')}
        onBlur={() => formik.handleBlur('contactId')}
        onChange={async (item) => {
          await formik.setFieldValue('contactId', item.value);
          await formik.submitForm();
        }}
      />

      {!isNullOrUndefined(selectedContact) && Object.keys(selectedContact)?.length > 0 && (
        <HStack py={3} justifyContent="flex-start" alignItems="center" space={2}>
          <Avatar
            size={8}
            source={formik?.values?.avatar?.uri ? { uri: formik.values.avatar.uri } : defaultAvatar}
          />

          <Text style={[layout.flex_1, fonts.size_14, fonts.gray900]}>
            {extractContactDisplayName(selectedContact)}
          </Text>

          <Button
            size={6}
            style={[borders.none]}
            backgroundColor="green600"
            onPress={() => {
              navigator.navigate('ContactEditScreen', { contact: nut?.contact ?? {} });
            }}
          >
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
  );
}

export default NutDetailsTabContact;
