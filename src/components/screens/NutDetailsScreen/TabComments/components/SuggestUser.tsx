/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';

import { useTheme } from '@/theme';
import { Avatar, Text } from 'native-base';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MentionPartType } from '../mention/types';
import { smart_search } from '@/helpers/search';

const HEIGHT_TAG_ITEM = 40;
const MAX_SUGGESTION_ITEM = 4;

const SuggestUser = ({
  keywordByTrigger,
  onSuggestionPress,
  mentionType,
  searchUsers,
  selection,
  searchText,
}: {
  keywordByTrigger: any;
  searchUsers: any[];
  onSuggestionPress: (mentionType: MentionPartType) => (user: any) => void;
  mentionType: MentionPartType;
  selection: any;
  searchText: string;
}) => {
  const { colors } = useTheme();
  const [data, setData] = useState<any[]>([]);
  const refTime = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!searchText) {
      clearTimeout(refTime.current);
      return setData([]);
    }
    clearTimeout(refTime.current);
    refTime.current = setTimeout(() => {
      let keyword = keywordByTrigger[mentionType.trigger] as any;
      if (keyword === undefined) return setData([]);
      let filter = smart_search(searchUsers, keyword);
      console.log(2222, {
        searchUsers,
        filter,
      });
      setData(filter);
    }, 100);
    return () => clearTimeout(refTime.current);
  }, [selection, searchText]);

  if (!data.length) return null;
  return (
    <View style={styles.wrapMention}>
      <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="none">
        {data.map((user) => (
          <TouchableOpacity
            key={user.id}
            onPress={() => onSuggestionPress(mentionType)(user)}
            style={styles.suggestionItem}
          >
            <Avatar size={30} backgroundColor={colors.gray200} source={{ uri: user.image || '' }} />
            <Text style={styles.textName} numberOfLines={1}>
              {user.name}
            </Text>
            <Text color={colors.gray400}>{user.email.split('@')[0]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SuggestUser;

const styles = StyleSheet.create({
  wrapMention: {
    maxHeight: HEIGHT_TAG_ITEM * MAX_SUGGESTION_ITEM,
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#FFFFFF' ?? '#FAFAFA',
    borderTopWidth: 2,
    borderTopColor: '#FAFAFA',
  },
  suggestionItem: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    height: HEIGHT_TAG_ITEM,
  },
  textName: {
    marginLeft: 12,
    color: 'black',
    flex: 1,
  },
});
