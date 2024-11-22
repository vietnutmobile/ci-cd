import { Button, Text } from '@/components/atoms';
import { getFileIcon } from '@/helpers/content';
import useToast from '@/helpers/hooks/use-toast';
import { useTheme } from '@/theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { HStack } from 'native-base'; // Assuming you're using NativeBase for toasts
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import * as Icons from 'react-native-heroicons/outline';

const useFilePicker = (formik, fieldName) => {
  const toast = useToast();
  const { layout, gutters, fonts, colors, borders, backgrounds } = useTheme();

  const [isLoading, setIsLoading] = useState(false);

  const pickFile = async () => {
    setIsLoading(true);
    try {
      const result = await DocumentPicker.pick({
        allowMultiSelection: true,
        mode: 'open',
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

      if (result.some((file) => file.size > 10 * 1024 * 1024)) {
        toast.show({
          title: 'File size should be less than 10MB',
          status: 'error',
        });
        return;
      }

      let files = [];

      for (const file of result) {
        const base64Data = await RNFS.readFile(decodeURIComponent(file.uri), 'base64');

        files.push({
          filename: file.name,
          size: file.size,
          contentType: file.type,
          base64data: base64Data,
        });
      }

      const updatedFiles = [...formik.values[fieldName], ...files];
      await formik.setFieldValue(fieldName, updatedFiles);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  const removeFile = async (index) => {
    const attachments = formik.values[fieldName].filter((_, fileIndex) => fileIndex !== index);
    await formik.setFieldValue(fieldName, attachments);
  };

  return { pickFile, removeFile, renderFile, isLoading };
};

export default useFilePicker;
