import { useConfirmDialog } from '@/components/hooks';
import { createHtmlViewBaseStyleSheet } from '@/helpers';
import { useGetNutCommentsQuery } from '@/store/services';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Box } from 'native-base';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import CommentItem from './components/CommentItem';

function NutDetailsTabComments() {
  const { confirm, renderDialog } = useConfirmDialog();
  const route = useRoute();

  const auth = useSelector((state) => state?.auth ?? {});
  const userId = auth?.user?.id ?? '';
  const { nutId } = route.params;

  const { data: comments, refetch: refetchComments } = useGetNutCommentsQuery({ nutId });

  const commentStyleSheet = useMemo(() => createHtmlViewBaseStyleSheet(), []);

  useFocusEffect(
    useCallback(() => {
      refetchComments();
    }, [refetchComments]),
  );

  return (
    <Box flex={1}>
      {(comments || []).map((comment) => (
        <CommentItem
          key={comment.id}
          confirmDelete={confirm}
          userId={userId}
          data={comment}
          stylesheet={commentStyleSheet}
        />
      ))}
      {renderDialog({
        title: 'Delete Comment',
        description: 'Are you sure you want to delete this comment?',
      })}
    </Box>
  );
}

export default NutDetailsTabComments;
