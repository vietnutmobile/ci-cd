import { Button, Image, Text } from '@/components/atoms';
import { ALL_TOOLBAR_ITEMS, HEADING_ITEMS } from '@/components/hooks/useRichTextEditor/constants';
import { customCSS } from '@/components/hooks/useRichTextEditor/custom-css';
import { useTheme } from '@/theme';
import {
  CodeBridge,
  CoreBridge,
  ImageBridge,
  LinkBridge,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  useBridgeState,
  useEditorBridge,
  useEditorContent,
} from '@10play/tentap-editor';
import { EditLinkBar } from '@10play/tentap-editor/src/RichText/Toolbar/EditLinkBar';
import { ToolbarContext } from '@10play/tentap-editor/src/RichText/Toolbar/Toolbar';
import { FlatList } from 'native-base';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

const useRichTextEditor = ({
  form,
  fieldName,
  initialValue,
  placeholder,
  editorConfigs = {
    toolbarItems: 'heading | bold italic underline | image | link bulletList orderedList',
  },
} = {}) => {
  const { layout, gutters, fonts, borders, backgrounds, dimensions } = useTheme();

  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: initialValue,
    debounceInterval: 20,
    canSetLink: true,
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(customCSS),
      PlaceholderBridge.configureExtension({
        placeholder: placeholder,
      }),
      LinkBridge.configureExtension({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
      }),
      ImageBridge.configureExtension({
        allowBase64: true,
      }),
      CodeBridge.configureExtension({}),
    ],
    ...editorConfigs,
  });

  const editorState = useBridgeState(editor);
  const content = useEditorContent(editor, { type: 'html' });

  const [toolbarContext, setToolbarContext] = useState(ToolbarContext.Main);

  const helpers = useMemo(
    () => ({
      editor,
      editorState,
      toolbarContext,
      setToolbarContext,
    }),
    [editor, editorState, toolbarContext, setToolbarContext],
  );

  useEffect(() => {
    if (content) {
      form.setFieldValue(fieldName, content);
      // console.log('content', content);
    }
  }, [content]);

  const toolbarItems = useMemo(() => {
    const itemsScheme =
      toolbarContext === ToolbarContext.Main
        ? editorConfigs.toolbarItems
        : 'close h1 h2 h3 h4 h5 h6';
    const items = itemsScheme.split(' ').map((item) => item.trim()) || [];

    return items
      .map((itemName) => ALL_TOOLBAR_ITEMS.find((toolbarItem) => toolbarItem.name === itemName))
      .filter(Boolean);
  }, [editorConfigs.toolbarItems, toolbarContext]);

  const renderEditor = useCallback(
    () => <RichText testID={'rich_text_editor'} editor={editor} />,
    [editor],
  );

  const renderToolbar = useCallback(() => {
    return toolbarContext === ToolbarContext.Link ? (
      <EditLinkBar
        theme={editor.theme}
        initialLink={editorState.activeLink}
        onBlur={() => setToolbarContext(ToolbarContext.Main)}
        onLinkIconClick={() => {
          setToolbarContext(ToolbarContext.Main);
          editor.focus();
        }}
        onEditLink={(link) => {
          editor.setLink(link);
          editor.focus();

          if (Platform.OS === 'android') {
            // On android we dont want to hide the link input before we finished focus on editor
            // Add here 100ms and we can try to find better solution later
            setTimeout(() => {
              setToolbarContext(ToolbarContext.Main);
            }, 100);
          } else {
            setToolbarContext(ToolbarContext.Main);
          }
        }}
      />
    ) : (
      <FlatList
        horizontal
        contentContainerStyle={[layout.flex_1, dimensions.fullWidth, layout.itemsCenter]}
        data={toolbarContext === ToolbarContext.Main ? toolbarItems : HEADING_ITEMS}
        keyExtractor={(item, index) => {
          return `${item.name}-${index}`;
        }}
        renderItem={({ item: { name, onPress, disabled, active, image, testID } }) => {
          const isActive = active(helpers);

          return name === '|' ? (
            <Text style={[gutters.paddingH_8, fonts.size_20_100, fonts.gray200]}>|</Text>
          ) : (
            <Button
              testID={testID}
              key={name}
              size={7}
              style={[
                gutters.marginH_4,
                borders.none,
                backgrounds.transparent,
                ...(isActive ? [backgrounds.gray200] : []),
              ]}
              onPress={onPress(helpers)}
              disabled={disabled(helpers)}
            >
              <Image
                source={image}
                style={[dimensions.width_28, dimensions.height_28]}
                resizeMode="cover"
              />
            </Button>
          );
        }}
      />
    );
  }, [editor, toolbarContext]);

  return { renderEditor, renderToolbar, editor };
};

export default useRichTextEditor;
