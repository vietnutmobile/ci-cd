import { Button, Text } from '@/components/atoms';
import useFilePicker from '@/components/hooks/useFilePicker';
import useRichTextEditor from '@/components/hooks/useRichTextEditor';
import { formatForwardEmail, htmlToPlainText } from '@/helpers';
import { DEFAULT_ERROR_MESSAGE, EMAIL_REGEX } from '@/helpers/constants';
import { extractValidEmails } from '@/helpers/email';
import { findFirsErrorMessage } from '@/helpers/error-handlers';
import useNavigator from '@/helpers/hooks/use-navigation';
import useToast from '@/helpers/hooks/use-toast';
import { cancelReplyEmail } from '@/store/features/email-composer';
import { useCreateNutEmailMutation, useGetNutWorkspaceEmailsQuery } from '@/store/services';
import { useTheme } from '@/theme';
import { useFormik } from 'formik';
import { HStack, VStack } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import * as Icons from 'react-native-heroicons/outline';
import TagInput from 'react-native-tag-input';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

function EmailForwardScreen() {
  const navigation = useNavigator();
  const dispatch = useDispatch();
  const toast = useToast();

  const { layout, gutters, fonts, colors, borders, backgrounds, dimensions } = useTheme();

  const emailComposer = useSelector((state) => state?.emailComposer ?? {});

  const { forwardEmail, nutId } = emailComposer;

  const [toInputText, setToInputText] = useState('');
  const [toEmails, setToEmails] = useState([]);
  const [ccInputText, setCcInputText] = useState('');
  const [ccEmails, setCcEmails] = useState([]);

  const [createNutEmail] = useCreateNutEmailMutation();
  const { data: workspaceEmails } = useGetNutWorkspaceEmailsQuery({ nutId }, { skip: !nutId });

  const validationSchema = Yup.object({
    cc: Yup.string(),
    to: Yup.string().required('To is required.'),
    email: Yup.object().shape({}),
    content: Yup.string()
      .transform((value) => htmlToPlainText(value))
      .test('is-text-empty', 'Content must not be empty.', (value) => value.trim().length > 0),
    attachments: Yup.array().of(Yup.object().shape({})),
  });

  const initialContent = useMemo(() => '', []);

  const formik = useFormik({
    validationSchema,
    enableReinitialize: true,
    initialValues: {
      workspaceEmailId: workspaceEmails?.[0]?.id ?? '',
      to: '',
      cc: '',
      email: forwardEmail,
      content: initialContent,
      attachments: [],
      images: [],
    },
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        const subjectPrefix = 'Fwd: ';

        await createNutEmail({
          ...values,
          email: {
            ...values.email,
            subject: `${subjectPrefix}${values.email?.subject ?? ''}`,
          },
          cc: extractValidEmails(values.cc),
          to: extractValidEmails(values.to),
          content: `${formatForwardEmail(`${values.content}<br />`, forwardEmail)}`,
        }).unwrap();
        toast.show({
          description: 'Send email successfully',
        });
        await formik.resetForm();
        setTimeout(() => {
          dispatch(cancelReplyEmail());
          navigation.back();
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
    initialValue: initialContent,
    placeholder: 'Write your email ✨...',
  });

  const handleEmailTagInputChange = async ({
    inputText,
    inputTextSetter,
    listSetter,
    formikField,
  }) => {
    inputTextSetter(inputText);

    const lastTyped = inputText.charAt(inputText.length - 1);
    const parseWhen = [',', ' ', ';', '\n'];

    const emails = inputText.match(EMAIL_REGEX) || [];

    if (parseWhen.indexOf(lastTyped) > -1 && emails?.length > 0) {
      const oldEmails = (formik.values?.[formikField] ?? '')
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean);
      const newCCEmails = [...new Set([...oldEmails, ...emails])];
      listSetter(newCCEmails);
      await formik.setFieldValue(formikField, newCCEmails.join(','));
      inputTextSetter(' ');
    }
  };

  const { pickFile, renderFile, isLoading } = useFilePicker(formik, 'attachments');

  const parseEmails = (emails) =>
    emails
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);

  useEffect(() => {
    setCcEmails(parseEmails(formik.values.cc));
    if (formik.values.cc.trim()) {
      setCcInputText(' ');
    }
  }, [formik.values.cc]);

  useEffect(() => {
    setToEmails(parseEmails(formik.values.to));
    if (formik.values.to.trim()) {
      setToInputText(' ');
    }
  }, [formik.values.to]);

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
            navigation.back();
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
            Forward as
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
              formik.setFieldValue('workspaceEmailId', item.value);
            }}
          />
        </VStack>
      </HStack>

      <View
        style={[
          layout.row,
          layout.itemsCenter,
          gutters.paddingV_0,
          gutters.paddingH_12,
          backgrounds.white,
          borders.bottom_1,
          borders.gray100,
        ]}
      >
        <Text style={[gutters.marginR_20, fonts.size_15_150, fonts.gray700]}>To</Text>

        <TagInput
          editable={true}
          inputProps={{
            style: [dimensions.minHeight_38, fonts.size_15, fonts.gray800],
            placeholder: 'Add emails...',
            onBlur: () =>
              handleEmailTagInputChange({
                inputText: `${toInputText} `,
                inputTextSetter: setToInputText,
                listSetter: setToEmails,
                formikField: 'to',
              }),
          }}
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
          value={toEmails}
          onChange={async (value) => {
            await formik.setFieldValue('to', value.join(','));
          }}
          tagTextStyle={[fonts.size_13_120, fonts.gray800]}
          text={toInputText}
          onChangeText={async (inputText) =>
            await handleEmailTagInputChange({
              inputText,
              inputTextSetter: setToInputText,
              listSetter: setToEmails,
              formikField: 'to',
            })
          }
        />
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
        ]}
      >
        <Text style={[gutters.marginR_20, fonts.size_15_150, fonts.gray700]}>Cc</Text>

        <TagInput
          editable={true}
          inputProps={{
            style: [dimensions.minHeight_38, fonts.size_15, fonts.gray800],
            placeholder: 'Add emails...',
            onBlur: () =>
              handleEmailTagInputChange({
                inputText: `${ccInputText} `,
                inputTextSetter: setCcInputText,
                listSetter: setCcEmails,
                formikField: 'cc',
              }),
          }}
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
          onChangeText={async (inputText) =>
            await handleEmailTagInputChange({
              inputText,
              inputTextSetter: setCcInputText,
              listSetter: setCcEmails,
              formikField: 'cc',
            })
          }
        />
      </View>

      {formik.values.attachments?.length > 0 &&
        formik.values.attachments.map((file, index) => renderFile({ item: file, index }))}

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

export default EmailForwardScreen;
