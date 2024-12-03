import { getFileIcon } from '@/helpers/content';
import { downloadFile } from '@/helpers/file-system';
import { useTheme } from '@/theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { Button, HStack, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';

function getFileType(filePath) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'heic', 'heif'];
  const excelExtensions = ['xml', 'xls', 'xlsm', 'xlsx'];
  const wordExtensions = ['doc', 'docm', 'docx', 'dot', 'dotx'];
  const fileExtension = filePath.split('.').pop()?.toLocaleLowerCase();
  if (imageExtensions.includes(fileExtension)) return 'jpg';
  else if (excelExtensions.includes(fileExtension)) return 'xsl';
  else if (wordExtensions.includes(fileExtension)) return 'doc';
  else if (fileExtension === 'pdf') return 'pdf';
  else return '';
}

const FileItem = ({ file, setSelectedFileId, showConfirmDeleteAlert }) => {
  const navigation = useNavigation();
  const { colors, borders, layout, fonts } = useTheme();
  const mimeIcon = getFileIcon(file.fileType) ?? getFileIcon('default');

  const handlePreview = () => {
    const fileType = getFileType(file.path);
    console.log('fileType', fileType);
    switch (fileType) {
      case 'jpg':
        navigation.navigate('PreviewImage', { url: file.url, fileType });
        break;
      case 'pdf':
        navigation.navigate('PreviewPdf', { url: file.url, fileType });
        break;
      default:
        break;
    }
  };

  return (
    <HStack
      py={2}
      space={2.5}
      alignItems="center"
      borderBottomWidth={1}
      borderBottomColor={colors.gray100}
    >
      <TouchableOpacity onPress={handlePreview}>
        <FontAwesomeIcon size={18} color={colors.blue500} icon={mimeIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={[layout.flex_1]} onPress={handlePreview}>
        <Text style={[layout.flex_1, fonts.size_13, fonts.medium, fonts.gray700]} numberOfLines={2}>
          {file?.name ?? ''}
        </Text>
      </TouchableOpacity>
      <HStack space={2} justifyContent="flex-end">
        <Button
          size={7}
          style={[borders._1, borders.green600]}
          backgroundColor="transparent"
          onPress={async () =>
            downloadFile({
              name: file.name,
              url: file.url,
            })
          }
        >
          <Icons.CloudArrowDownIcon size={14} color={colors.green600} />
        </Button>

        <Button
          size={7}
          style={[borders._1, borders.red600]}
          backgroundColor="transparent"
          onPress={() => {
            setSelectedFileId(file.id);
            showConfirmDeleteAlert();
          }}
        >
          <Icons.TrashIcon size={14} color={colors.red600} />
        </Button>
      </HStack>
      {/* <Text style={[fonts.size_13, fonts.medium, fonts.gray500]}>{file?.fileType ?? ''}</Text> */}
    </HStack>
  );
};

export default FileItem;

// import { getFileIcon } from '@/helpers/content';
// import { HStack, View, Text, Button } from 'native-base';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { useTheme } from '@/theme';
// import { downloadFile } from '@/helpers/file-system';
// import * as Icons from 'react-native-heroicons/outline';

// const PreviewFile = ({ file, setSelectedFileId, showConfirmDeleteAlert }) => {
//   const { colors, gutters, borders, backgrounds, layout, fonts } = useTheme();
//   const mimeIcon = getFileIcon(file.fileType) ?? getFileIcon('default');

//   return (
//     <HStack py={1} space={2} alignItems="center">
//       <View style={[gutters.padding_4, borders.rounded_4, backgrounds.blue100, layout.itemsCenter]}>
//         <FontAwesomeIcon color={colors.blue500} icon={mimeIcon} />
//       </View>

//       <Text style={[layout.flex_1, fonts.size_13, fonts.medium, fonts.gray700]}>
//         {file?.name ?? ''}
//       </Text>

//       <Text style={[fonts.size_13, fonts.medium, fonts.gray500]}>{file?.fileType ?? ''}</Text>

//       <HStack space={1.5} alignItems="center">
//         <Button
//           size={6}
//           style={[borders._1, borders.green600]}
//           backgroundColor="transparent"
//           onPress={async () =>
//             downloadFile({
//               name: file.name,
//               url: file.url,
//             })
//           }
//         >
//           <Icons.CloudArrowDownIcon size={13} color={colors.green600} />
//         </Button>

//         <Button
//           size={6}
//           style={[borders._1, borders.red600]}
//           backgroundColor="transparent"
//           onPress={() => {
//             setSelectedFileId(file.id);
//             showConfirmDeleteAlert();
//           }}
//         >
//           <Icons.TrashIcon size={13} color={colors.red600} />
//         </Button>
//       </HStack>
//     </HStack>
//   );
// };

// export default PreviewFile;
