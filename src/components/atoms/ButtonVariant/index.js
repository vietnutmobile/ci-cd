import { testSelector } from '@/helpers/test-utils';
import { Button as NBButton, IconButton as BNIconButton } from 'native-base';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';

const Button = ({ children, type, style, disabled, ...props }) => {
  const ButtonTag = useMemo(() => {
    if (type === 'icon') {
      return BNIconButton;
    }
    if (type === 'native') {
      return TouchableOpacity;
    }
    return NBButton;
  }, [type]);

  const testIDProps = children ? testSelector(`button_${children}`) : {};

  return (
    <ButtonTag
      {...testIDProps}
      disabled={disabled}
      style={[
        style,
        {
          opacity: disabled ? 0.35 : 1,
        },
      ]}
      {...props}
    >
      {children}
    </ButtonTag>
  );
};

export default Button;
