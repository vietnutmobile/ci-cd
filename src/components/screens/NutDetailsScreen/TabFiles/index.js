import { Text } from '@/components/atoms';
import { findFirsErrorMessage } from '@/helpers/error-handlers';
import useToast from '@/helpers/hooks/use-toast';
import { createNutFileValidation } from '@/helpers/validation';
import {
  useAttachFileToNutMutation,
  useDeleteNutFileMutation,
  useGetNutFilesQuery,
} from '@/store/services';
import { useTheme } from '@/theme';
import { Images } from '@/theme/ImageProvider';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useFormik } from 'formik';
import { AlertDialog, HStack, VStack } from 'native-base';
import { useCallback, useRef, useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
import * as Icons from 'react-native-heroicons/outline';
import Button from '../../../atoms/ButtonVariant';
import FileItem from '../../../atoms/FileItem';
function NutDetailsTabFiles() {
  const route = useRoute();
  const toast = useToast();

  const { layout, gutters, fonts, colors, borders, effects, backgrounds, dimensions } = useTheme();

  const { nutId } = route.params;

  const [attachFileToNut] = useAttachFileToNutMutation();
  const [deleteNutFile] = useDeleteNutFileMutation();
  const { data: files, refetch: refetchFiles } = useGetNutFilesQuery(
    { id: nutId },
    {
      skip: !nutId,
    },
  );

  const cancelRef = useRef(null);
  const [selectedFileId, setSelectedFileId] = useState('');
  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const showConfirmDeleteAlert = () => setIsAlertOpened(true);
  const hideConfirmDeleteAlert = () => setIsAlertOpened(false);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: createNutFileValidation(),
    initialValues: {
      nutId: nutId,
      file: null,
    },
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        await attachFileToNut(values).unwrap();
        toast.show({
          description: 'File uploaded successfully',
        });
      } catch (error) {
        toast.show({
          description: findFirsErrorMessage(error) || 'Unable to upload file',
        });
      } finally {
        formik.setSubmitting(false);
        formik.resetForm();
      }
    },
  });

  const pickFile = async () => {
    formik.setSubmitting(true);
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
          DocumentPicker.types.images,
          DocumentPicker.types.zip,
        ],
      });

      const firstFile = result?.[0] ?? {};

      if ((firstFile?.size ?? 0) > 10 * 1024 * 1024) {
        toast.show({
          title: 'File size should be less than 10MB',
          status: 'error',
        });
        return;
      }
      console.log(result);
      await formik.setFieldValue('file', firstFile);
      await formik.submitForm();
    } catch (err) {
      console.log(err);
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        throw err;
      }
    } finally {
      formik.setSubmitting(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refetchFiles();
    }, [refetchFiles]),
  );

  return (
    <>
      <VStack space={2} alignItems="flex-start">
        <Button
          disabled={formik.isSubmitting}
          py={1.5}
          px={2}
          style={[borders._1, borders.green600, backgrounds.white]}
          leftIcon={
            formik.isSubmitting ? (
              <Images.IC_SPINNER
                width={15}
                height={15}
                color={colors.green600}
                fill={colors.white}
              />
            ) : (
              <Icons.CloudArrowUpIcon size={15} color={colors.green600} />
            )
          }
          onPress={pickFile}
        >
          <Text style={[fonts.size_14, fonts.green600]}>Upload file</Text>
        </Button>
      </VStack>

      <VStack pt={2} space={2} alignItems="flex-start">
        {files?.length > 0 &&
          files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              setSelectedFileId={setSelectedFileId}
              showConfirmDeleteAlert={showConfirmDeleteAlert}
            />
          ))}
      </VStack>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isAlertOpened}
        onClose={hideConfirmDeleteAlert}
      >
        <AlertDialog.Content>
          <AlertDialog.Header px={3} py={2}>
            <Text style={[fonts.size_14, fonts.semi, fonts.gray700]}>Delete file</Text>
          </AlertDialog.Header>
          <AlertDialog.Body px={3} py={4}>
            <Text style={[fonts.size_14, fonts.gray700]}>
              Are you sure you want to delete this file?
            </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer px={3} py={2}>
            <HStack justifyContent="end" alignItems="center" space={2}>
              <Button
                isDiabled={formik.isSubmitting}
                py={1.5}
                variant="unstyled"
                onPress={hideConfirmDeleteAlert}
              >
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
                    await deleteNutFile({ id: selectedFileId }).unwrap();
                  } catch (error) {
                    console.log(error);
                  } finally {
                    setSelectedFileId('');
                  }
                  hideConfirmDeleteAlert();
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

export default NutDetailsTabFiles;
