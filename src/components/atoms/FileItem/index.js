import { getFileIcon } from '@/helpers/content';
import { HStack, View, Text, Button } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '@/theme';
import { downloadFile } from '@/helpers/file-system';
import * as Icons from 'react-native-heroicons/outline';

const FileItem = ({ file, setSelectedFileId, showConfirmDeleteAlert }) => {
  const { colors, gutters, borders, backgrounds, layout, fonts } = useTheme();
  const mimeIcon = getFileIcon(file.fileType) ?? getFileIcon('default');

  return (
    <HStack
      py={2}
      space={2.5}
      alignItems="center"
      borderBottomWidth={1}
      borderBottomColor={colors.gray100}
    >
      <View style={[gutters.padding_4, borders.rounded_4, backgrounds.blue100, layout.itemsCenter]}>
        <FontAwesomeIcon size={18} color={colors.blue500} icon={mimeIcon} />
      </View>

      <Text style={[layout.flex_1, fonts.size_13, fonts.medium, fonts.gray700]} numberOfLines={2}>
        {file?.name ?? ''}
      </Text>
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
