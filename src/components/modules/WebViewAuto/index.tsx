/* eslint-disable react-native/no-inline-styles */
import {Spinner} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Linking, StyleSheet, useWindowDimensions, View} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';

const injectedJavaScript = `  
function findWidestElement() {
  let elements = document.querySelectorAll("*");
  let maxWidth = 0;

  elements.forEach(element => {
      const elementWidth = element.getBoundingClientRect().width;
      if (elementWidth > maxWidth) {
          maxWidth = elementWidth;
      }
  });
  let data = {
    maxWidth: maxWidth,
    type: 'maxWidth',
  }

  window.ReactNativeWebView.postMessage(maxWidth.toString());
}

setTimeout(findWidestElement, 0);
`;

const customStyle = (scale: number, maxWidth: number) => {
  return `
            * {
              font-family: 'Inter' !important;
              font-size: 14px;
            }
            body {
              transform: scale(${scale});
              transform-origin: top left;
            }
            p {
              max-width: ${maxWidth}px;
              word-wrap: break-word;
            }
          `;
};

type Props = {
  html: string;
  scrollToItem?: () => void;
  useLoading?: boolean;
};

const WebViewAuto = ({html, scrollToItem, useLoading = false}: Props) => {
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const {width} = useWindowDimensions();
  const htmlRenderWidth = width - 28;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <>
      {loading && useLoading && (
        <View style={styles.loading}>
          <Spinner size="sm" color="green.500" />
        </View>
      )}
      <AutoHeightWebView
        style={{
          width: htmlRenderWidth,
          marginTop: 18,
          backgroundColor: '#FFFFFF',
        }}
        customStyle={customStyle(scale, htmlRenderWidth)}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        source={{
          html,
        }}
        onNavigationStateChange={event => {
          if (event.url !== 'about:blank') {
            return false;
          }
        }}
        showsVerticalScrollIndicator={false}
        onShouldStartLoadWithRequest={request => {
          let isOpenLink = request.url.startsWith('http');
          if (isOpenLink) {
            Linking.openURL(request.url);
            return false;
          }
          return true;
        }}
        onLoadEnd={() => {
          scrollToItem?.();
        }}
        bounces={false}
        scrollEnabled={false}
        viewportContent={'width=device-width, user-scalable=no'}
        customScript={injectedJavaScript}
        onMessage={event => {
          if (event.nativeEvent.data && scale === 1) {
            setScale(
              htmlRenderWidth /
                Math.max(Number(event.nativeEvent.data), htmlRenderWidth),
            );
            setLoading(false);
          }
        }}
        // contentInsetAdjustmentBehavior="automatic"
        // scalesPageToFit={true}
        // onSizeUpdated={(size) => {
        //   console.log('size.width', size.width);
        // }}
      />
    </>
  );
};

export default WebViewAuto;

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    paddingTop: 60,
  },
});
