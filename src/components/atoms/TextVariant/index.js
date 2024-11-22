import { testSelector } from '@/helpers/test-utils';
import { useTheme } from '@/theme';
import { Text as RNText } from 'react-native';

export const TextVariant = ({ style, ...props }) => {
  const { fonts } = useTheme();
  const children = props.children;

  return (
    <RNText
      {...testSelector(`text_${children}`)}
      allowFontScaling
      style={[fonts.interRegular, fonts.size_15_140, fonts.gray900, style]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default TextVariant;
