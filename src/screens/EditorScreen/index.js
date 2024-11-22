import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

export const EditorScreen = () => {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent,
  });

  return (
    <>
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={exampleStyles.keyboardAvoidingView}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </>
  );
};

const exampleStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    margin: 10,
    borderWidth: 1,
    borderColor: 'red',
  },
  keyboardAvoidingView: {
    position: 'absolute',
    width: '100%',
    margin: 10,
    height: 50,
    backgroundColor: 'blue',
    bottom: 0,
  },
});

const initialContent = `<p>This is a basic example!</p>`;

export default EditorScreen;
