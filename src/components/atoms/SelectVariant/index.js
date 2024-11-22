import RequiredLabel from '@/components/atoms/RequiredLabel';
import Text from '@/components/atoms/TextVariant';
import { isNullOrUndefined } from '@/helpers';
import { testSelector } from '@/helpers/test-utils';
import { useTheme } from '@/theme';
import { FormControl, Select as NBSelect } from 'native-base';
import React from 'react';

const Select = ({
  error,
  items,
  label,
  labelStyle,
  required,
  onChange,
  onBlur,
  style,
  ...props
}) => {
  const { layout, gutters, fonts, backgrounds, dimensions } = useTheme();

  const testIDProps = props.name ? testSelector(`select_${props.name}`) : {};

  return (
    <FormControl isRequire={required} isInvalid={!isNullOrUndefined(error)}>
      {label && (
        <Text
          style={[
            layout.flex_1,
            gutters.marginB_6,
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
      <NBSelect
        isReadOnly
        onValueChange={(item) => {
          onChange(item);
          if (onBlur) onBlur();
        }}
        {...testIDProps}
        style={[
          gutters.padding_0,
          gutters.margin_0,
          dimensions.height_36,
          fonts.interRegular,
          fonts.size_15,
          fonts.gray900,
          style,
        ]}
        {...props}
      >
        {items.map((item) => (
          <NBSelect.Item {...item} />
        ))}
      </NBSelect>
      {error && <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>}
    </FormControl>
  );
};

export default Select;
