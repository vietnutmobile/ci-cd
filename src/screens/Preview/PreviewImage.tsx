/* eslint-disable react-native/no-inline-styles */
import ImageAutoSize from '@/components/modules/ImageAutoSize';
import { useTheme } from '@/theme';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Zoom from 'react-native-zoom-reanimated';

export default function PreviewImage() {
  const route = useRoute<any>();
  const url = route?.params?.url;
  const navigation = useNavigation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <TouchableOpacity
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.2)',
          position: 'absolute',
          zIndex: 1,
          top: insets.top + 10,
          left: 16,
        }}
        onPress={() => navigation.goBack()}
      >
        <FontAwesomeIcon icon={faChevronLeft} size={17} color={colors.white} />
      </TouchableOpacity>
      <Zoom style={styles.container} doubleTapConfig={{ minZoomScale: 0.3, maxZoomScale: 2.5 }}>
        <ImageAutoSize source={{ uri: url }} />
      </Zoom>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
  },
});
