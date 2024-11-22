import { Text, Textarea } from '@/components/atoms';
import { useConfirmDialog } from '@/components/hooks';
import { NOTE_DATE_FORMAT, toastErrorConfigs } from '@/helpers/constants';
import useToast from '@/helpers/hooks/use-toast';
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useGetNotesQuery,
  useGetNutByIdQuery,
  useUpdateNoteMutation,
} from '@/store/services';
import { useTheme } from '@/theme';
import defaultAvatar from '@/theme/assets/images/default-avatar.jpeg';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import { Avatar, HStack } from 'native-base';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';
import Button from '../../../atoms/ButtonVariant';

function NutDetailsTabNotes() {
  const route = useRoute();
  const toast = useToast();
  const { confirm: confirmDeleteNote, renderDialog } = useConfirmDialog({
    mainCta: 'Yes',
    secondaryCta: 'No',
  });

  const { nutId } = route.params;

  const { data: nut } = useGetNutByIdQuery({ id: nutId, include: 'contact' }, { skip: !nutId });
  const {
    data: notes,
    refetch: refetchNotes,
    isLoading: isLoadingNotes,
  } = useGetNotesQuery({ nutId: nutId }, { skip: !nutId });

  const [noteCreate] = useCreateNoteMutation();
  const [noteUpdate] = useUpdateNoteMutation();
  const [noteDelete] = useDeleteNoteMutation();

  const [isEditing, setIsEditing] = useState({});

  const assignee = nut?.assignedUser;

  const { layout, gutters, fonts, colors, borders, effects, backgrounds, dimensions } = useTheme();

  const formikEdit = useFormik({
    initialValues: {
      noteId: '',
      notes: '',
    },
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        await noteUpdate({
          noteId: values.noteId,
          content: values.notes,
        }).unwrap();
      } catch (error) {
        console.log(error);
        toast.show({
          ...toastErrorConfigs,
          description: error.message,
        });
      } finally {
        formik.resetForm();
        setIsEditing({});
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      notes: '',
    },
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        await noteCreate({
          nutId,
          content: values.notes,
        }).unwrap();
        formik.resetForm();
      } catch (error) {
        console.log(error);
        toast.show({
          ...toastErrorConfigs,
          description: error.message,
        });
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetchNotes();
    }, [refetchNotes]),
  );

  return (
    <>
      <HStack space={2} alignItems="flex-start">
        <View style={[layout.flex_1]}>
          <Textarea
            h={12}
            w="100%"
            disabled={formik.isSubmitting}
            placeholder="Personal notes"
            name="notes"
            value={formik.values.notes}
            onChangeText={formik.handleChange('notes')}
            onBlur={formik.handleBlur('notes')}
            error={formik.touched.notes && formik.errors.notes}
          />
        </View>

        <Button
          disabled={formik.isSubmitting}
          px={3}
          py={1.5}
          style={[backgrounds.green600]}
          onPress={() => formik.submitForm()}
        >
          <Text style={[fonts.size_14, fonts.semi, fonts.white]}>Submit</Text>
        </Button>
      </HStack>

      {notes?.length > 0 &&
        notes.map((note) => {
          const { id, user, content, createdAt } = note;

          const isEditingNote = isEditing[id];

          return (
            <HStack
              style={[borders.rounded_8, backgrounds.blue50]}
              mt={3}
              px={2.5}
              py={3}
              space={3}
              key={id}
            >
              <Avatar size={6} source={user?.image ? { uri: user?.image } : defaultAvatar} />

              <View style={[layout.flex_1]}>
                <HStack mb={2}>
                  <Text style={[fonts.size_14, fonts.semi, fonts.gray900]}>{user?.name ?? ''}</Text>
                  <Text
                    style={[fonts.size_14, fonts.gray600]}
                  >{` · ${format(new Date(createdAt), NOTE_DATE_FORMAT)}`}</Text>
                </HStack>

                <HStack space={2}>
                  {isEditingNote ? (
                    <Textarea
                      h={12}
                      w="100%"
                      disabled={formikEdit.isSubmitting}
                      placeholder="Personal notes"
                      name="notes"
                      value={formikEdit.values.notes}
                      onChangeText={formikEdit.handleChange('notes')}
                      onBlur={formikEdit.handleBlur('notes')}
                      error={formikEdit.touched.notes && formikEdit.errors.notes}
                    />
                  ) : (
                    <Text style={[fonts.size_14, fonts.gray900]}>{content}</Text>
                  )}
                </HStack>
              </View>

              <HStack space={1.5}>
                {isEditingNote ? (
                  <Button
                    size={6}
                    style={[borders._1, borders.green600]}
                    backgroundColor="transparent"
                    onPress={() => formikEdit.submitForm()}
                  >
                    <Icons.ArrowDownTrayIcon size={13} color={colors.green600} />
                  </Button>
                ) : (
                  <Button
                    size={6}
                    style={[borders._1, borders.green600]}
                    backgroundColor="transparent"
                    onPress={() => {
                      formikEdit.setValues({
                        noteId: id,
                        notes: content,
                      });
                      setIsEditing({
                        [id]: true,
                      });
                    }}
                  >
                    <Icons.PencilIcon size={13} color={colors.green600} />
                  </Button>
                )}

                <Button
                  size={6}
                  style={[borders._1, borders.red600]}
                  backgroundColor="transparent"
                  onPress={async () => {
                    if (await confirmDeleteNote()) {
                      await noteDelete({ noteId: id }).unwrap();
                    }
                    toast.show({
                      description: 'Successfully deleted note!',
                    });
                  }}
                >
                  <Icons.TrashIcon size={13} color={colors.red600} />
                </Button>
              </HStack>
            </HStack>
          );
        })}

      {renderDialog({
        title: 'Delete Note',
        description: 'Are you sure you want to delete this note?',
        mainCta: 'Yes',
        secondaryCta: 'No',
      })}
    </>
  );
}

export default NutDetailsTabNotes;
