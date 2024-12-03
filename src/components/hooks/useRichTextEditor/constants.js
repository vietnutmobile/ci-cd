import { pickImage } from '@/helpers/file-system';
import { EditorIcons } from '@/theme/assets/images/text-editor';
import { ToolbarContext } from '@10play/tentap-editor/src/RichText/Toolbar/Toolbar';
import { Platform } from 'react-native';

export const DEFAULT_TOOLBAR_ITEMS = [
  {
    name: '|',
    testID: 'rt_toolbar_button_separator',
    onPress:
      ({ editor }) =>
      () => {},
    active: ({ editorState }) => false,
    disabled: ({ editorState }) => false,
    image: () => null,
  },
  {
    name: 'bold',
    testID: 'rt_toolbar_button_bold',
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
    testID: 'rt_toolbar_button_italic',
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
    testID: 'rt_toolbar_button_link',
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
    testID: 'rt_toolbar_button_taskList',
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
    testID: 'rt_toolbar_button_heading',
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
    testID: 'rt_toolbar_button_code',
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
    testID: 'rt_toolbar_button_underline',
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
    testID: 'rt_toolbar_button_strike',
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
    testID: 'rt_toolbar_button_blockquote',
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
    testID: 'rt_toolbar_button_orderedList',
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
    testID: 'rt_toolbar_button_bulletList',
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleBulletList(),
    active: ({ editorState }) => editorState.isBulletListActive,
    disabled: ({ editorState }) => !editorState.canToggleBulletList,
    image: () => EditorIcons.bulletList,
  },
  {
    name: 'indent',
    testID: 'rt_toolbar_button_indent',
    onPress:
      ({ editor, editorState }) =>
      () =>
        editorState.canSink ? editor.sink() : editor.sinkTaskListItem(),
    active: () => false,
    disabled: ({ editorState }) => !editorState.canSink && !editorState.canSinkTaskListItem,
    image: () => EditorIcons.indent,
  },
  {
    name: 'outdent',
    testID: 'rt_toolbar_button_outdent',
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
    testID: 'rt_toolbar_button_undo',
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
    testID: 'rt_toolbar_button_redo',
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
    testID: 'rt_toolbar_button_image',
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
    testID: 'rt_toolbar_button_close',
    onPress:
      ({ setToolbarContext }) =>
      () =>
        setToolbarContext(ToolbarContext.Main),
    active: () => false,
    disabled: () => false,
    image: () => EditorIcons.close,
  },
  ...['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((name, index) => ({
    name,
    testID: `rt_toolbar_button_${name}`,
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleHeading(index + 1),
    active: ({ editorState }) => editorState.headingLevel === index + 1,
    disabled: ({ editorState }) => !editorState.canToggleHeading,
    image: () => EditorIcons[name],
  })),
];

export const ALL_TOOLBAR_ITEMS = DEFAULT_TOOLBAR_ITEMS.concat(HEADING_ITEMS);
