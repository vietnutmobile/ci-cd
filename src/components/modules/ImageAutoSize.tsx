import { Image, ImageSourcePropType, ImageURISource } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import FastImage, { FastImageProps, Source } from 'react-native-fast-image';
export type ImageProps = FastImageProps & {
  source: ImageURISource | Source;
};

const ImageAutoSize = (props: ImageProps) => {
  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
    aspectRatio: 0,
  });
  useLayoutEffect(() => {
    if (props.source?.uri)
      Image.getSize(props.source.uri as any, (width, height) => {
        setImageSize({ width, height, aspectRatio: width / height });
      });
    else {
      const { width, height } = Image.resolveAssetSource(props.source as ImageSourcePropType);
      setImageSize({ width, height, aspectRatio: width / height });
    }
  }, []);
  return <FastImage {...props} style={[imageSize, props.style]} />;
};

export default ImageAutoSize;
