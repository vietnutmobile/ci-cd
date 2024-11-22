import useToast from '@/helpers/hooks/use-toast';
import { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const useImagePicker = (editor) => {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const pickFile = async () => {
    setIsLoading(true);
    try {
      const result = await DocumentPicker.pick({
        mode: 'open',
        type: [DocumentPicker.types.images],
      });

      if (result.size > 10 * 1024 * 1024) {
        toast.show({
          title: 'File size should be less than 10MB',
          status: 'error',
        });
        return;
      }

      const base64Data = await RNFS.readFile(decodeURIComponent(result.uri), 'base64');

      editor.commands.setImage({
        src: base64Data,
        alt: 'A boring example image',
        title: 'An example',
      });
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

  const removeFile = async (index) => {};

  return { pickFile, removeFile, isLoading };
};

export default useImagePicker;
