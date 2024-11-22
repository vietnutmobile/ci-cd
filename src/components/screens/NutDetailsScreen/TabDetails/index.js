import { Input, Select, Text } from '@/components/atoms';
import { debounce } from '@/helpers';
import { USER_ROLE_ADMIN } from '@/helpers/constants';
import { getUserNameFromEmail } from '@/helpers/content';
import useNavigator from '@/helpers/hooks/use-navigation';
import useToast from '@/helpers/hooks/use-toast';
import { createNutValidationSchema } from '@/helpers/validation/nut';
import {
  useDeleteNutMutation,
  useGetContactsQuery,
  useGetNutByIdQuery,
  useGetOrganizationMembersQuery,
  useGetPipelineStagesQuery,
  useGetUserProfileQuery,
  useUpdateNutMutation,
} from '@/store/services';
import { useTheme } from '@/theme';
import { useRoute } from '@react-navigation/native';
import { useFormik } from 'formik';
import { AlertDialog, HStack, VStack } from 'native-base';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';
import Button from '../../../atoms/ButtonVariant';

const toastErrorConfigs = {
  variant: 'subtle',
};

function NutDetailsTabDetails() {
  const route = useRoute();
  const toast = useToast();
  const navigator = useNavigator();
  const cancelRef = useRef(null);

  const { layout, gutters, fonts, colors, borders, effects, backgrounds, dimensions } = useTheme();

  const { nutId } = route.params;

  const [debounceContactKeywords, setDebounceContactKeywords] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isAlertOpened, setIsAlertOpened] = useState(false);

  const { data: userData } = useGetUserProfileQuery();

  const orgId = userData?.orgId ?? '';

  const { data: contactResponse } = useGetContactsQuery(
    {
      keywords: debounceContactKeywords || '',
    },
    {
      skip: !debounceContactKeywords,
    },
  );

  const { data: nut } = useGetNutByIdQuery({ id: nutId, include: 'contact' }, { skip: !nutId });

  const { data: stages } = useGetPipelineStagesQuery(
    { pipelineId: nut?.stage?.pipelineId },
    { skip: !nut?.stage?.pipelineId },
  );
  const { data: orgMembers } = useGetOrganizationMembersQuery(
    {
      orgId,
    },
    {
      skip: !orgId,
    },
  );

  const [updateNut] = useUpdateNutMutation();
  const [deleteNut] = useDeleteNutMutation();

  const isAdminUser = userData?.role === USER_ROLE_ADMIN;

  const assigneeOptions = (orgMembers ?? []).map((member) => ({
    key: member?.id,
    value: member?.id,
    label: member?.name || getUserNameFromEmail(member?.email),
  }));

  const stageOptions = (stages ?? []).map((stage) => ({
    key: stage?.id,
    value: stage?.id ?? '',
    label: stage?.name ?? '',
  }));

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

  const showConfirmDeleteAlert = () => setIsAlertOpened(true);
  const hideConfirmDeleteAlert = () => setIsAlertOpened(false);

  const renderItem = (item) => {
    return (
      <View style={[gutters.paddingH_12, gutters.paddingV_10]}>
        <Text style={[fonts.size_14, fonts.gray900]}>{item.label}</Text>
      </View>
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
    <>
      <View>
        <VStack space={3}>
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
              disabled={!isAdminUser}
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
        </VStack>
      </View>

      <HStack
        mt={4}
        py={3}
        space={2}
        justifyContent="space-between"
        alignItems="center"
        style={[borders.top_1, borders.gray200]}
      >
        <Button
          leftIcon={<Icons.TrashIcon size={14} color={colors.red500} />}
          disabled={formik.isSubmitting}
          px={3}
          py={1.5}
          style={[backgrounds.white, borders._1, borders.red500]}
          onPress={showConfirmDeleteAlert}
        >
          <Text style={[fonts.size_15, fonts.semi, fonts.red500]}>Delete</Text>
        </Button>

        <Button
          leftIcon={<Icons.CheckCircleIcon size={14} color={colors.white} />}
          disabled={formik.isSubmitting}
          px={3}
          py={1.5}
          style={[backgrounds.green600]}
          onPress={() => formik.submitForm()}
        >
          <Text style={[fonts.size_15, fonts.semi, fonts.white]}>Save</Text>
        </Button>
      </HStack>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isAlertOpened}
        onClose={hideConfirmDeleteAlert}
      >
        <AlertDialog.Content>
          <AlertDialog.Header px={3} py={2}>
            <Text style={[fonts.size_14, fonts.semi, fonts.gray700]}>Delete Nut</Text>
          </AlertDialog.Header>
          <AlertDialog.Body px={3} py={4}>
            <Text style={[fonts.size_14, fonts.gray700]}>
              This nut will be deleted. This actions can not be undone. Are you sure?
            </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer px={3} py={2}>
            <HStack justifyContent="end" alignItems="center" space={2}>
              <Button py={1.5} variant="unstyled" onPress={hideConfirmDeleteAlert}>
                <Text style={[fonts.size_14, fonts.semi, fonts.line_18, fonts.gray700]}>
                  Cancel
                </Text>
              </Button>
              <Button
                isDiabled={formik.isSubmitting}
                py={1.5}
                style={[backgrounds.red500]}
                onPress={async () => {
                  try {
                    await deleteNut({ id: nutId }).unwrap();
                    await navigator.back();
                  } catch (error) {
                    toast.show({
                      ...toastErrorConfigs,
                      description: error.message,
                    });
                  }
                }}
              >
                <Text style={[fonts.size_14, fonts.semi, fonts.white]}>Delete</Text>
              </Button>
            </HStack>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  );
}

export default NutDetailsTabDetails;
