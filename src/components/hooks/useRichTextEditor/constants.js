import { pickImage } from '@/helpers/file-system';
import { EditorIcons } from '@/theme/assets/images/text-editor';
import { ToolbarContext } from '@10play/tentap-editor/src/RichText/Toolbar/Toolbar';
import { Platform } from 'react-native';

export const DEFAULT_TOOLBAR_ITEMS = [
  {
    name: '|',
    onPress:
      ({ editor }) =>
      () => {},
    active: ({ editorState }) => false,
    disabled: ({ editorState }) => false,
    image: () => null,
  },
  {
    name: 'bold',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleBold(),
    active: ({ editorState }) => editorState.isBoldActive,
    disabled: ({ editorState }) => !editorState.canToggleBold,
    image: () => EditorIcons.bold,
  },
  {
    name: 'italic',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleItalic(),
    active: ({ editorState }) => editorState.isItalicActive,
    disabled: ({ editorState }) => !editorState.canToggleItalic,
    image: () => EditorIcons.italic,
  },
  {
    name: 'link',
    onPress:
      ({ setToolbarContext, editorState, editor }) =>
      () => {
        console.log('click Link');
        if (Platform.OS === 'android') {
          setTimeout(() => {
            editor.setSelection(editorState.selection.from, editorState.selection.to);
          });
        }
        setToolbarContext(ToolbarContext.Link);
      },
    active: ({ editorState }) => editorState.isLinkActive,
    disabled: () => false,
    image: () => EditorIcons.link,
  },
  {
    name: 'taskList',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleTaskList(),
    active: ({ editorState }) => editorState.isTaskListActive,
    disabled: ({ editorState }) => !editorState.canToggleTaskList,
    image: () => EditorIcons.checkList,
  },
  {
    name: 'heading',
    onPress:
      ({ setToolbarContext }) =>
      () =>
        setToolbarContext(ToolbarContext.Heading),
    active: () => false,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => EditorIcons.Aa,
  },
  {
    name: 'code',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleCode(),
    active: ({ editorState }) => editorState.isCodeActive,
    disabled: ({ editorState }) => !editorState.canToggleCode,
    image: () => EditorIcons.code,
  },
  {
    name: 'underline',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleUnderline(),
    active: ({ editorState }) => editorState.isUnderlineActive,
    disabled: ({ editorState }) => !editorState.canToggleUnderline,
    image: () => EditorIcons.underline,
  },
  {
    name: 'strike',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleStrike(),
    active: ({ editorState }) => editorState.isStrikeActive,
    disabled: ({ editorState }) => !editorState.canToggleStrike,
    image: () => EditorIcons.strikethrough,
  },
  {
    name: 'blockquote',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleBlockquote(),
    active: ({ editorState }) => editorState.isBlockquoteActive,
    disabled: ({ editorState }) => !editorState.canToggleBlockquote,
    image: () => EditorIcons.quote,
  },
  {
    name: 'orderedList',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleOrderedList(),
    active: ({ editorState }) => editorState.isOrderedListActive,
    disabled: ({ editorState }) => !editorState.canToggleOrderedList,
    image: () => EditorIcons.orderedList,
  },
  {
    name: 'bulletList',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleBulletList(),
    active: ({ editorState }) => editorState.isBulletListActive,
    disabled: ({ editorState }) => !editorState.canToggleBulletList,
    image: () => EditorIcons.bulletList,
  },
  {
    // Regular list items (li) and task list items both use the
    // same sink command and button just with a different parameter, so we check both states here
    name: 'indent',
    onPress:
      ({ editor, editorState }) =>
      () =>
        editorState.canSink ? editor.sink() : editor.sinkTaskListItem(),
    active: () => false,
    disabled: ({ editorState }) => !editorState.canSink && !editorState.canSinkTaskListItem,
    image: () => EditorIcons.indent,
  },
  {
    // Regular list items (li) and task list items both use the
    // same lift command and button just with a different parameter, so we check both states here
    name: 'outdent',
    onPress:
      ({ editor, editorState }) =>
      () =>
        editorState.canLift ? editor.lift() : editor.liftTaskListItem(),
    active: () => false,
    disabled: ({ editorState }) => !editorState.canLift && !editorState.canLiftTaskListItem,
    image: () => EditorIcons.outdent,
  },
  {
    name: 'undo',
    onPress:
      ({ editor }) =>
      () =>
        editor.undo(),
    active: () => false,
    disabled: ({ editorState }) => !editorState.canUndo,
    image: () => EditorIcons.undo,
  },
  {
    name: 'redo',
    onPress:
      ({ editor }) =>
      () =>
        editor.redo(),
    active: () => false,
    disabled: ({ editorState }) => !editorState.canRedo,
    image: () => EditorIcons.redo,
  },
  {
    name: 'image',
    onPress:
      ({ editor }) =>
      async () => {
        const file = await pickImage();
        editor.setImage(file.base64);
      },
    active: () => false,
    disabled: ({ editorState }) => false,
    image: () => EditorIcons.image,
  },
];

export const HEADING_ITEMS = [
  {
    name: 'close',
    onPress:
      ({ setToolbarContext }) =>
      () =>
        setToolbarContext(ToolbarContext.Main),
    active: () => false,
    disabled: () => false,
    image: () => EditorIcons.close,
  },
  {
    name: 'h1',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleHeading(1),
    active: ({ editorState }) => editorState.headingLevel === 1,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => EditorIcons.h1,
  },
  {
    name: 'h2',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleHeading(2),
    active: ({ editorState }) => editorState.headingLevel === 2,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => EditorIcons.h2,
  },
  {
    name: 'h3',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleHeading(3),
    active: ({ editorState }) => editorState.headingLevel === 3,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => EditorIcons.h3,
  },
  {
    name: 'h4',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleHeading(4),
    active: ({ editorState }) => editorState.headingLevel === 4,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => EditorIcons.h4,
  },
  {
    name: 'h5',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleHeading(5),
    active: ({ editorState }) => editorState.headingLevel === 5,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => EditorIcons.h5,
  },
  {
    name: 'h6',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleHeading(6),
    active: ({ editorState }) => editorState.headingLevel === 6,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => EditorIcons.h6,
  },
];

export const ALL_TOOLBAR_ITEMS = DEFAULT_TOOLBAR_ITEMS.concat(HEADING_ITEMS);
