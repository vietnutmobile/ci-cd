/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { DEFAULT_ERROR_MESSAGE } from '@/helpers/constants';
import { findFirsErrorMessage } from '@/helpers/error-handlers';
import useToast from '@/helpers/hooks/use-toast';
import { convert_data } from '@/helpers/search';
import {
  useCreateNutCommentMutation,
  useGetNutCommentsQuery,
  useGetOrganizationMembersQuery,
  useGetUserProfileQuery,
} from '@/store/services';
import { useTheme } from '@/theme';
import { useRoute } from '@react-navigation/native';
import { Box, Button, HStack } from 'native-base';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
} from 'react-native';
import * as Icons from 'react-native-heroicons/outline';
import { MentionPartType, PartType, Suggestion } from '../mention/types';
import {
  defaultMentionTextStyle,
  generateValueFromPartsAndChangedText,
  generateValueWithAddedSuggestion,
  getMentionPartSuggestionKeywords,
  isMentionPartType,
  parseValue,
} from '../mention/util';
import SuggestUser from './SuggestUser';

const partTypes: PartType[] = [
  {
    trigger: '@',
    textStyle: { color: '#16a34a' },
  },
];

const HEIGHT_TAG_ITEM = 40;
const MAX_SUGGESTION_ITEM = 4;

const getNameUser = (user: any) => {
  return user.name || user.email.split('@')[0];
};

const InputComment = () => {
  const { colors } = useTheme();

  const { data: userData } = useGetUserProfileQuery<any>({});

  const orgId = userData?.orgId ?? '';
  const { data: orgMembers } = useGetOrganizationMembersQuery(
    { orgId },
    {
      skip: !orgId,
    },
  );
  const route = useRoute();
  const toast = useToast();
  const { nutId } = route.params as { nutId: string };

  const [createNutComment] = useCreateNutCommentMutation();
  const { refetch: refetchComments } = useGetNutCommentsQuery({ nutId });

  const inputRef = useRef<TextInput>(null);

  const [text, setText] = useState('');

  const { plainText, parts } = useMemo(() => parseValue(text, partTypes), [text]);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [searchUsers, setSearchUsers] = useState<any[]>([]);
  const [mentionUsers, setMentionUsers] = useState<any[]>([]);

  const onSuggestionPress = (mentionType: MentionPartType) => async (suggestion: Suggestion) => {
    const newValue = generateValueWithAddedSuggestion(
      parts,
      mentionType,
      plainText,
      selection,
      suggestion,
    );
    if (!newValue) {
      return;
    }
    setText(newValue);
  };

  useEffect(() => {
    if (!orgMembers) return;
    const dataMapping = ((orgMembers as any[]) || []).map((user: any) => ({
      ...user,
      name: getNameUser(user),
    }));
    let convertUsers = convert_data(dataMapping, 'name');
    setMentionUsers(convertUsers);
    setSearchUsers(convertUsers);
  }, [orgMembers]);

  useEffect(() => {
    let ids = parts.filter((i) => !!i.partType).map((part) => part.data?.id + '');
    let newSearchUser = mentionUsers.filter((user) => !ids.includes(user.id + ''));
    setSearchUsers(newSearchUser);
  }, [parts]);

  const onChangeInput = (changedText: string) => {
    setText(generateValueFromPartsAndChangedText(parts, plainText, changedText));
  };
  const handleSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => {
    setSelection(event.nativeEvent.selection);
  };

  const keywordByTrigger = useMemo(() => {
    return getMentionPartSuggestionKeywords(parts, plainText, selection, partTypes);
  }, [parts, plainText, selection, partTypes]);

  const convertTextToMention = (user: any) => {
    return `<span data-mention-user-email="${user.email}" data-mention-user-id="${user.id}"> @${getNameUser(user)} </span>&nbsp;`;
  };

  const sendComment = async () => {
    try {
      let content = parts
        .map((part) => {
          if (part.partType) {
            return convertTextToMention(part.data);
          }
          return part.text;
        })
        .join('');
      content = `<p>${content}</p>`;
      await createNutComment({
        nutId,
        content,
      }).unwrap();
      refetchComments();
      inputRef.current?.clear();
      setText('');
    } catch (error) {
      toast.show({
        description: findFirsErrorMessage(error) || DEFAULT_ERROR_MESSAGE,
      });
    }
  };

  const renderMentionSuggestions = (mentionType: MentionPartType) => {
    return (
      <SuggestUser
        keywordByTrigger={keywordByTrigger}
        searchUsers={searchUsers}
        onSuggestionPress={onSuggestionPress}
        mentionType={mentionType}
        selection={selection}
        searchText={text}
      />
    );
  };

  return (
    <>
      {(partTypes.filter((one) => isMentionPartType(one)) as MentionPartType[]).map(
        renderMentionSuggestions,
      )}
      <Box width="100%" backgroundColor="gray.100" rounded="md" mt={2}>
        <HStack space={2} width="100%">
          <TextInput
            multiline
            textAlignVertical="top"
            ref={inputRef}
            style={[styles.input]}
            placeholder="Send a comment"
            placeholderTextColor={colors.gray400}
            autoCorrect={false}
            spellCheck={false}
            autoFocus
            autoComplete="off"
            selectionColor={colors.green600}
            onChangeText={onChangeInput}
            onSelectionChange={handleSelectionChange}
          >
            <Text>
              {parts.map(({ text, partType, data }, index) =>
                partType ? (
                  <Text
                    key={`${index}-${data?.trigger ?? 'pattern'}`}
                    style={partType.textStyle ?? defaultMentionTextStyle}
                  >
                    {text}
                  </Text>
                ) : (
                  <Text key={index}>{text}</Text>
                ),
              )}
            </Text>
          </TextInput>
          <Button
            variant="ghost"
            disabled={!text}
            opacity={!text ? 0.5 : 1}
            onPress={() => {
              sendComment();
            }}
          >
            <Icons.PaperAirplaneIcon color={colors.green600} />
          </Button>
        </HStack>
      </Box>
    </>
  );
};

export default InputComment;

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingLeft: 10,
    maxHeight: 100,
    minHeight: 40,
    paddingTop: 12,
    paddingBottom: 10,
  },
  wrapMention: {
    maxHeight: HEIGHT_TAG_ITEM * MAX_SUGGESTION_ITEM,
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#FAFAFA',
  },
  suggestionItem: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    height: HEIGHT_TAG_ITEM,
  },
});
