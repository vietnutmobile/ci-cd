import Text from '@/components/atoms/TextVariant';
import { isNullOrUndefined } from '@/helpers';
import { testSelector } from '@/helpers/test-utils';
import { useTheme } from '@/theme';
import { FormControl, TextArea as NBTextarea } from 'native-base';
import React from 'react';

const TextareaVariant = ({ style, labelStyle, label, required, error, ...props }) => {
  const { layout, fonts, borders, gutters, backgrounds } = useTheme();

  const testIDProps = props.name ? testSelector(`textarea_${props.name}`) : {};

  return (
    <FormControl isRequire={required} isInvalid={!isNullOrUndefined(error)}>
      {label && (
        <Text
          style={[gutters.marginB_4, fonts.interRegular, fonts.size_15, fonts.gray900, labelStyle]}
        >
          {label}
        </Text>
      )}
      <NBTextarea
        {...testIDProps}
        style={[
          layout.flex_1,
          fonts.interRegular,
          fonts.size_15_120,
          fonts.gray900,
          backgrounds.white,
          borders.none,
          style,
        ]}
        {...props}
      />
      {error && (
        <Text style={[gutters.marginT_4, gutters.marginL_12, fonts.size_13, fonts.red500]}>
          {error}
        </Text>
      )}
    </FormControl>
  );
};

export default TextareaVariant;
