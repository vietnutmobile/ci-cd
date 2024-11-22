import { Text } from '@/components/atoms';
import RequiredLabel from '@/components/atoms/RequiredLabel';
import { testSelector } from '@/helpers/test-utils';
import { useTheme } from '@/theme';
import { HStack, VStack } from 'native-base';
import React, { useMemo, useState } from 'react';
import { TextInput as RNTextInput } from 'react-native';

const TextInputVariant = ({
  label,
  labelStyle,
  style,
  innerStyle,
  containerStyle,
  leftIcon,
  rightIcon,
  error,
  required,
  disabled,
  ...props
}) => {
  const { layout, fonts, borders, gutters, backgrounds, colors, dimensions } = useTheme();
  const LeftIcon = useMemo(() => leftIcon, []);
  const RightIcon = useMemo(() => rightIcon, []);

  const testIDProps = props.name ? testSelector(`input_${props.name}`) : {};

  return (
    <VStack style={containerStyle}>
      {label && (
        <Text
          style={[
            gutters.marginB_6,
            layout.flex_1,
            fonts.size_14_150,
            fonts.medium,
            fonts.gray700,
            labelStyle,
          ]}
        >
          {label}
          {required && <RequiredLabel />}
        </Text>
      )}
      <HStack
        alignItems="center"
        space={2}
        style={[
          gutters.paddingH_12,
          gutters.paddingV_6,
          borders._1,
          borders.rounded_4,
          backgrounds.white,
          ...(error ? [borders.red500] : [borders.gray300]),
          style,
        ]}
      >
        {leftIcon && <LeftIcon />}
        <RNTextInput
          {...testIDProps}
          autoCapitalize="none"
          style={[
            layout.flex_1,
            layout.itemsCenter,
            gutters.padding_0,
            gutters.margin_0,
            dimensions.height_20,
            fonts.interRegular,
            fonts.size_15_100,
            fonts.gray900,
            backgrounds.white,
            borders.none,
            innerStyle,
          ]}
          editable={!disabled}
          placeholderTextColor={colors.gray400}
          {...props}
        />
        {rightIcon && <RightIcon />}
      </HStack>
      {error && (
        <Text style={[gutters.marginT_4, gutters.marginL_2, fonts.size_12, fonts.red600]}>
          {error}
        </Text>
      )}
    </VStack>
  );
};

export default TextInputVariant;

const AutoExpandingTextInput = (props) => {
  const [text, setText] = useState('');
  const [height, setHeight] = useState(35);

  return (
    <TextInputVariant
      {...props}
      multiline
      value={text}
      onChangeText={setText}
      onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
      style={[{ height: Math.max(35, height) }]}
    />
  );
};

export { AutoExpandingTextInput };
