/* eslint-disable react-native/no-inline-styles */
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Zoom from 'react-native-zoom-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageAutoSize from '@/components/modules/ImageAutoSize';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/theme';
import Pdf from 'react-native-pdf';

export default function PreviewPdf() {
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
      <Pdf
        source={{
          uri: url,
        }}
        onLoadComplete={(numberOfPages) => {
          // console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page) => {
          // console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          // console.log(`Link pressed: ${uri}`);
        }}
        trustAllCerts={false}
        style={styles.pdf}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  backButton: {
    position: 'absolute',
  },
});
