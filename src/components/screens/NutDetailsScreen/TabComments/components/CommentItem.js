import { Button, Text } from '@/components/atoms';
import { isNullOrUndefined, preprocessHTML } from '@/helpers';
import { NOTE_DATE_FORMAT } from '@/helpers/constants';
import { useDeleteNutCommentMutation } from '@/store/services';
import { useTheme } from '@/theme';
import defaultAvatar from '@/theme/assets/images/default-avatar.jpeg';
import { format } from 'date-fns';
import { Avatar, HStack, View, VStack } from 'native-base';
import { useWindowDimensions } from 'react-native';
import RenderHtml, { HTMLElementModel } from 'react-native-render-html';
import { useSelector } from 'react-redux';

const mentionCurrentUserModel = HTMLElementModel.fromCustomModel({
  tagName: 'mention-current-user',
  mixedUAStyles: {
    fontWeight: '500',
  },
  contentModel: 'textual',
});

function CommentItem({ confirmDelete, data, stylesheet, userId, level = 1 }) {
  const { layout, gutters, fonts, colors, borders, effects, backgrounds, dimensions } = useTheme();
  const { id, user, content, createdAt, children, parentId } = data;

  const { width } = useWindowDimensions();
  const htmlRenderWidth = width - 48;

  const auth = useSelector((state) => state?.auth ?? {});
  const userEmail = auth?.user?.email ?? '';

  const allowedActions = userEmail === user?.email ? ['reply', 'edit', 'delete'] : ['reply'];

  const [deleteNutComment] = useDeleteNutCommentMutation();

  const isSubComment = !isNullOrUndefined(parentId);
  const processedContent = preprocessHTML(content, userId);

  return (
    <HStack
      key={id}
      style={[borders.rounded_8, isSubComment ? backgrounds.blue50 : {}]}
      px={2.5}
      mb={2}
      space={3}
      pt={level === 1 ? 0 : 3}
    >
      <Avatar size={6} source={user?.image ? { uri: user?.image } : defaultAvatar} />

      <View style={[layout.flex_1]}>
        <HStack mb={2}>
          <Text style={[fonts.size_14, fonts.semi, fonts.gray900]}>{user?.name || ''}</Text>
          <Text
            style={[fonts.size_14, fonts.gray600]}
          >{` · ${format(new Date(createdAt), NOTE_DATE_FORMAT)}`}</Text>
        </HStack>

        <HStack space={2}>
          <Text style={[fonts.size_14, fonts.gray900]}>
            <RenderHtml
              contentWidth={htmlRenderWidth}
              tagsStyles={stylesheet}
              source={{ html: processedContent }}
              customHTMLElementModels={{
                'mention-current-user': mentionCurrentUserModel,
                'mention-user': mentionCurrentUserModel,
              }}
            />
          </Text>
        </HStack>

        <HStack my={1} space={3}>
          {/* <Button type="native" onPress={() => {}}>
            <Text style={[fonts.size_14, fonts.gray700, fonts.green600]}>Reply</Text>
          </Button>

          <Button type="native" onPress={() => {}}>
            <Text style={[fonts.size_14, fonts.gray700]}>Edit</Text>
          </Button> */}

          {allowedActions.includes('delete') && (
            <Button
              type="native"
              onPress={async () => {
                const isConfirmed = await confirmDelete();
                if (isConfirmed) {
                  await deleteNutComment({
                    id,
                  }).unwrap();
                }
              }}
            >
              <Text style={[fonts.size_14, fonts.gray500]}>Delete</Text>
            </Button>
          )}
        </HStack>

        {children?.length > 0 && (
          <VStack mt={1} space={2}>
            {children.map((child) => (
              <CommentItem
                key={child.id}
                level={2}
                data={child}
                stylesheet={stylesheet}
                userId={userId}
              />
            ))}
          </VStack>
        )}
      </View>
    </HStack>
  );
}

export default CommentItem;
