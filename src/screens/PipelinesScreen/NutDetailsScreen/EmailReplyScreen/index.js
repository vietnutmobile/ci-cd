import { Button, Text } from '@/components/atoms';
import useFilePicker from '@/components/hooks/useFilePicker';
import useRichTextEditor from '@/components/hooks/useRichTextEditor';
import { addPreviousContentToReplyEmailBody, htmlToPlainText, splitEmailSender } from '@/helpers';
import { DEFAULT_ERROR_MESSAGE, EMAIL_REGEX, MODE_REPLY_ALL } from '@/helpers/constants';
import { getFileIcon } from '@/helpers/content';
import { extractValidEmails } from '@/helpers/email';
import { findFirsErrorMessage } from '@/helpers/error-handlers';
import useNavigator from '@/helpers/hooks/use-navigation';
import useToast from '@/helpers/hooks/use-toast';
import { cancelReplyEmail } from '@/store/features/email-composer';
import { useCreateNutEmailMutation, useGetUserProfileQuery } from '@/store/services';
import { useTheme } from '@/theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFormik } from 'formik';
import { HStack, VStack } from 'native-base';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';
import TagInput from 'react-native-tag-input';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

function EmailReplyScreen() {
  const navigation = useNavigator();
  const dispatch = useDispatch();
  const toast = useToast();

  const { layout, gutters, fonts, colors, borders, backgrounds, dimensions, effects } = useTheme();

  const emailComposer = useSelector((state) => state?.emailComposer ?? {});
  const [ccInputText, setCcInputText] = useState('');
  const [ccEmails, setCcEmails] = useState([]);

  const { data: userData } = useGetUserProfileQuery();
  const [createNutEmail] = useCreateNutEmailMutation();

  const signatures = useMemo(() => userData?.signatures ?? [], [userData]);
  const firstUsedSignature =
    useMemo(() => signatures?.find((signature) => signature?.used), [signatures])?.content ?? '';

  const { replyEmail, mode } = emailComposer;

  const isReplyAll = useMemo(() => mode === MODE_REPLY_ALL, [mode]);

  const validationSchema = Yup.object({
    cc: Yup.string(),
    to: Yup.string().required('To is required.'),
    email: Yup.object().shape({}),
    content: Yup.string()
      .transform((value) => htmlToPlainText(value))
      .test('is-text-empty', 'Content must not be empty.', (value) => value.trim().length > 0),
    attachments: Yup.array().of(Yup.object().shape({})),
  });

  const initialCCEmails = useMemo(
    () => extractValidEmails([...(replyEmail?.ccEmails ?? [])].join(',')),
    [replyEmail],
  );

  const initialContent = useMemo(() => `<br />${firstUsedSignature}`, [firstUsedSignature]);

  const formik = useFormik({
    validationSchema,
    enableReinitialize: true,
    initialValues: {
      cc: isReplyAll ? initialCCEmails.join(',') : '',
      to: replyEmail?.sender ?? '',
      email: replyEmail,
      content: initialContent,
      attachments: [],
    },
    onSubmit: async (values) => {
      formik.setSubmitting(true);

      try {
        const subjectPrefix = 'Re: ';

        await createNutEmail({
          ...values,
          email: {
            ...values.email,
            subject: `${subjectPrefix}${values.email?.subject ?? ''}`,
          },
          to: extractValidEmails(values.to),
          cc: extractValidEmails(values.cc),
          content: addPreviousContentToReplyEmailBody(values.content, replyEmail),
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

  const { pickFile, removeFile } = useFilePicker(formik, 'attachments');

  const renderFile = useCallback(({ item, index }) => {
    const mimeIcon = getFileIcon(item?.contentType ?? 'default');

    return (
      <HStack
        key={index}
        style={[borders.bottom_1, borders.gray200]}
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

  useEffect(() => {
    const newCCEmails = (formik.values?.cc ?? '')
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);
    setCcEmails(newCCEmails);
  }, [formik.values.cc]);

  useEffect(() => {
    formik.setFieldValue('to', splitEmailSender(replyEmail?.sender)?.email ?? '');
  }, [replyEmail?.sender]);

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

        <VStack space={1}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[fonts.size_18_120, fonts.semi, fonts.white]}
          >
            Reply
          </Text>

          <Text numberOfLines={1} ellipsizeMode="tail" style={[fonts.size_13_150, fonts.white]}>
            To: {replyEmail?.sender}
          </Text>
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
            await handleEmailTagInputChange({
              inputText,
              inputTextSetter: setCcInputText,
              listSetter: setCcEmails,
              formikField: 'cc',
            });
          }}
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

export default EmailReplyScreen;
