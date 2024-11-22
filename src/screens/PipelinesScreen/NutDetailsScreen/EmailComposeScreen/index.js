import { Button, Input, Text } from '@/components/atoms';
import useFilePicker from '@/components/hooks/useFilePicker';
import useRichTextEditor from '@/components/hooks/useRichTextEditor';
import { extractValidEmails, htmlToPlainText } from '@/helpers';
import { DEFAULT_ERROR_MESSAGE, EMAIL_REGEX } from '@/helpers/constants';
import { extractContactDisplayName, getFileIcon } from '@/helpers/content';
import { findFirsErrorMessage } from '@/helpers/error-handlers';
import useNavigator from '@/helpers/hooks/use-navigation';
import { cancelReplyEmail } from '@/store/features/email-composer';
import {
  useCreateNutFirstEmailMutation,
  useGetNutByIdQuery,
  useGetNutWorkspaceEmailsQuery,
} from '@/store/services';
import { useTheme } from '@/theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFormik } from 'formik';
import { HStack, VStack } from 'native-base';
import { Toast as toast } from 'native-base/src';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import * as Icons from 'react-native-heroicons/outline';
import TagInput from 'react-native-tag-input';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

function EmailComposeScreen() {
  const navigator = useNavigator();
  const dispatch = useDispatch();
  const { layout, gutters, fonts, colors, borders, backgrounds, dimensions } = useTheme();

  const emailComposer = useSelector((state) => state?.emailComposer ?? {});
  const [ccInputText, setCcInputText] = useState('');
  const [ccEmails, setCcEmails] = useState([]);

  const { nutId, mode } = emailComposer;
  const [createNutFirstEmail] = useCreateNutFirstEmailMutation();
  const { data: nut } = useGetNutByIdQuery({ id: nutId, include: 'contact' }, { skip: !nutId });
  const { data: workspaceEmails } = useGetNutWorkspaceEmailsQuery({ nutId }, { skip: !nutId });

  const [ccHeight, setCcHeight] = useState(40);
  const [selectedWorkspaceEmail, setSelectedWorkspaceEmail] = useState(workspaceEmails?.[0] ?? {});

  const validationSchema = Yup.object({
    cc: Yup.string(),
    subject: Yup.string().required('Subject must not be empty.'),
    email: Yup.object().shape({}),
    content: Yup.string()
      .transform((value) => htmlToPlainText(value))
      .test('is-text-empty', 'Content must not be empty.', (value) => value.trim().length > 0),
    attachments: Yup.array().of(Yup.object().shape({})),
  });

  const formik = useFormik({
    validationSchema,
    enableReinitialize: true,
    initialValues: {
      workspaceEmailId: workspaceEmails?.[0]?.id ?? '',
      nutId,
      subject: nut?.name,
      to: `${extractContactDisplayName(nut?.contact ?? '')} <${nut?.contact?.email ?? ''}>`,
      cc: '',
      content: '',
      attachments: [],
    },
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        await createNutFirstEmail({
          workspaceEmailId: values.workspaceEmailId,
          nutId,
          subject: values.subject ?? nut?.name,
          sender: values.to,
          recipient: selectedWorkspaceEmail?.name,
          ccEmails: extractValidEmails(values.cc),
          replyMessageBodyHTML: values.content,
          attachmentFiles: values.attachments,
        }).unwrap();
        toast.show({
          description: 'Send email successfully',
        });
        await formik.resetForm();
        setTimeout(() => {
          dispatch(cancelReplyEmail());
          navigator.back();
        }, 200);
      } catch (error) {
        toast.show({
          description: findFirsErrorMessage(error) || DEFAULT_ERROR_MESSAGE,
        });
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  const { renderEditor: renderEmailContentEditor, renderToolbar } = useRichTextEditor({
    form: formik,
    fieldName: 'content',
    placeholder: 'Write your email ✨...',
  });

  const { pickFile, removeFile, isLoading } = useFilePicker(formik, 'attachments');

  const renderFile = useCallback(({ item, index }) => {
    const mimeIcon = getFileIcon(item?.contentType ?? 'default');

    return (
      <HStack
        key={index}
        style={[backgrounds.white, borders.bottom_1, borders.gray100]}
        py={3}
        px={3}
        space={2}
        alignItems="center"
      >
        <View
          style={[gutters.padding_4, borders.rounded_4, backgrounds.blue50, layout.itemsCenter]}
        >
          <FontAwesomeIcon color={colors.blue500} icon={mimeIcon} />
        </View>

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[layout.flex_1, fonts.size_14, fonts.gray700]}
        >
          {item.filename} ({Math.round(item.size / 1024)}K)
        </Text>

        <Button
          size={7}
          style={[borders.none, backgrounds.transparent]}
          onPress={() => removeFile(index)}
        >
          <Icons.XMarkIcon size={20} color={colors.gray700} />
        </Button>
      </HStack>
    );
  }, []);

  useEffect(() => {
    const newCCEmails = (formik.values?.cc ?? '')
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);
    setCcEmails(newCCEmails);
  }, [formik.values.cc]);

  return (
    <SafeAreaView style={[layout.flex_1, gutters.marginB_12]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.green600} />

      <HStack
        style={[gutters.paddingH_8, gutters.paddingV_10, backgrounds.green600]}
        alignItems="center"
        space={3}
      >
        <Button
          size={7}
          style={[borders.none, backgrounds.transparent]}
          onPress={() => {
            dispatch(cancelReplyEmail());
            navigator.back();
          }}
        >
          <Icons.XMarkIcon size={22} color={colors.white} />
        </Button>

        <VStack flex={1} space={1}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[fonts.size_18_120, fonts.semi, fonts.white]}
          >
            Send as
          </Text>

          <Dropdown
            containerStyle={[gutters.padding_4, borders.rounded_4, fonts.white]}
            style={[dimensions.height_28, borders.none]}
            placeholderStyle={[fonts.white]}
            selectedTextStyle={[fonts.interRegular, fonts.size_15, fonts.medium, fonts.white]}
            labelField="label"
            valueField="value"
            renderItem={(item) => {
              return (
                <HStack key={item.key} flex={1} style={[gutters.paddingH_10, gutters.paddingV_12]}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[fonts.size_15, fonts.gray900]}
                  >
                    {item.label}
                  </Text>
                </HStack>
              );
            }}
            data={workspaceEmails.map((workspaceEmail) => ({
              key: workspaceEmail?.id,
              value: workspaceEmail?.id,
              label: workspaceEmail?.name,
            }))}
            renderRightIcon={() => (
              <Icons.ChevronDownIcon style={[gutters.marginL_8]} size={15} color={colors.white} />
            )}
            value={formik.values.workspaceEmailId}
            onFocus={() => formik.setFieldTouched('workspaceEmailId')}
            onBlur={() => formik.handleBlur('workspaceEmailId')}
            onChange={(item) => {
              setSelectedWorkspaceEmail(workspaceEmails.find((email) => email.id === item.value));
              formik.setFieldValue('workspaceEmailId', item.value);
            }}
          />
        </VStack>
      </HStack>

      <View
        style={[
          layout.row,
          layout.itemsCenter,
          gutters.paddingH_12,
          backgrounds.white,
          borders.bottom_1,
          borders.gray100,
          {
            minHeight: 48,
          },
        ]}
      >
        <Text style={[dimensions.width_40, fonts.size_15_150, fonts.gray700]}>To</Text>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[layout.flex_1, gutters.paddingV_8, fonts.size_15_150, fonts.gray700]}
        >
          {formik.values.to}
        </Text>
      </View>

      <View
        style={[
          layout.row,
          layout.itemsCenter,
          gutters.paddingV_0,
          gutters.paddingH_12,
          backgrounds.white,
          borders.bottom_1,
          borders.gray100,
          {
            minHeight: Math.max(48, ccHeight),
          },
        ]}
      >
        <Text style={[gutters.marginR_20, fonts.size_15_150, fonts.gray700]}>Cc</Text>

        <TagInput
          editable={true}
          inputProps={{
            style: [dimensions.minHeight_38, fonts.size_15, fonts.gray800],
          }}
          placeholder={'cc'}
          maxHeight={124}
          tagContainerStyle={[
            gutters.paddingV_0,
            dimensions.minHeight_24,
            gutters.marginL_4,
            borders.rounded_4,
            backgrounds.slate200,
          ]}
          labelExtractor={(value) => {
            return value?.split(',');
          }}
          value={ccEmails}
          onChange={async (value) => {
            await formik.setFieldValue('cc', value.join(','));
          }}
          tagTextStyle={[fonts.size_13_120, fonts.gray800]}
          text={ccInputText}
          onChangeText={async (inputText) => {
            setCcInputText(inputText);

            const lastTyped = inputText.charAt(inputText.length - 1);
            const parseWhen = [',', ' ', ';', '\n'];

            const emails = inputText.match(EMAIL_REGEX) || [];

            if (parseWhen.indexOf(lastTyped) > -1 && emails?.length > 0) {
              const newCCEmails = [...new Set([...ccEmails, ...emails])];
              await formik.setFieldValue('cc', newCCEmails.join(','));
              // Must be a whitespace to avoid triggering onChange
              setCcInputText(' ');
            }
          }}
        />
      </View>

      {formik.values.attachments?.length > 0 &&
        formik.values.attachments.map((file, index) => renderFile({ item: file, index }))}

      <View
        style={[
          layout.row,
          layout.itemsCenter,
          gutters.paddingV_0,
          backgrounds.white,
          borders.bottom_1,
          borders.gray100,
          {
            minHeight: 48,
          },
        ]}
      >
        <Input
          placeholder="Subject"
          containerStyle={[layout.flex_1, borders.none]}
          style={[gutters.paddingH_12, gutters.paddingV_10, borders.none]}
          innerStyle={[fonts.size_15_100, fonts.gray900]}
          value={formik.values.subject}
          onChangeText={formik.handleChange('subject')}
          onBlur={formik.handleBlur('subject')}
          error={formik.touched.subject && formik.errors.subject}
        />
      </View>

      <View style={[layout.flex_1, gutters.paddingH_12, backgrounds.white]}>
        {renderEmailContentEditor()}
      </View>

      <View style={[dimensions.height_60]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[layout.absolute, layout.bottom0, layout.fullWidth]}
      >
        <HStack
          flex={1}
          space={2}
          justifyContent="space-between"
          alignItems="center"
          style={[gutters.paddingH_12, gutters.paddingV_14, backgrounds.white]}
        >
          <Button
            disabled={formik.isSubmitting}
            size={8}
            style={[borders.none, backgrounds.transparent]}
            onPress={pickFile}
          >
            <Icons.PaperClipIcon size={22} color={colors.gray500} />
          </Button>

          <View
            style={[
              layout.flex_1,
              layout.itemsCenter,
              borders.left_1,
              borders.right_1,
              borders.gray200,
              gutters.paddingH_8,
              // gutters.paddingV_2,
            ]}
          >
            {renderToolbar()}
          </View>

          <Button
            disabled={formik.isSubmitting}
            size={8}
            style={[borders.none, backgrounds.transparent]}
            onPress={() => formik.submitForm()}
          >
            <Icons.PaperAirplaneIcon size={24} color={colors.green600} />
          </Button>
        </HStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default EmailComposeScreen;
