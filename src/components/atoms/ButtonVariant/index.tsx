import { testSelector } from '@/helpers/test-utils';
import { Button as NBButton, IconButton as BNIconButton, IButtonProps } from 'native-base';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';

type ButtonProps = IButtonProps & {
  children: React.ReactNode;
  type?: 'icon' | 'native' | 'default';
  style?: any;
  disabled?: boolean;
};

const Button = ({ children, type = 'default', style, disabled, ...props }: ButtonProps) => {
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
