import {
  EDITOR_EVENT_INIT,
  EDITOR_EVENT_RESIZE,
  EDITOR_STATUS_ERROR,
  EDITOR_STATUS_READY,
} from '@/helpers/constants';
import useToast from '@/helpers/hooks/use-toast';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

function WebViewEditor({ isDisabled, editoRef, onMessage, style, ...props }) {
  const toast = useToast();

  const [editorHeight, setEditorHeight] = useState(100);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const messageHandler = (event) => {
    const message = JSON.parse(event.nativeEvent.data);
    const { eventName, data } = message;

    if (eventName === EDITOR_EVENT_INIT && data?.status === EDITOR_STATUS_READY) {
      setIsEditorReady(true);
    } else if (eventName === EDITOR_EVENT_INIT && data?.status === EDITOR_STATUS_ERROR) {
      toast.show({
        variant: 'subtle',
        description: 'Editor failed to initialize',
      });
    } else if (eventName === EDITOR_EVENT_RESIZE && data?.height) {
      setEditorHeight(data.height);
    }
    onMessage({ eventName, data });
  };

  return (
    <View>
      <WebView
        ref={editoRef}
        addLineBreaks={false}
        onMessage={messageHandler}
        style={[
          {
            opacity: isEditorReady ? 1 : 0,
            height: editorHeight || 100,
          },
          style,
        ]}
        {...props}
      />
      {isDisabled && <View style={styles.overlay} />}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WebViewEditor;
