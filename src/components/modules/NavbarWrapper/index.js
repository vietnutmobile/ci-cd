import { Text } from '@/components/atoms';
import Button from '@/components/atoms/ButtonVariant';
import useNavigator from '@/helpers/hooks/use-navigation';
import { useTheme } from '@/theme';
import { Box, HStack } from 'native-base';
import * as Icons from 'react-native-heroicons/outline';

function NavbarWrapper({
  renderCenter,
  renderAfter,
  shouldShowBackButton = false,
  shouldPadEnd = true,
} = {}) {
  const navigator = useNavigator();

  const { layout, gutters, colors, dimensions, fonts } = useTheme();

  const hasBefore = shouldShowBackButton;
  const hasAfter = renderAfter !== undefined;
  const hasBeforeButNotAfter = hasBefore && !hasAfter;

  const inlineCenterStyles = {
    paddingLeft: hasBefore ? 12 : 0,
    paddingRight: hasAfter ? 12 : 0,
    ...(hasBeforeButNotAfter
      ? {
          paddingRight: shouldPadEnd ? 82 : 0,
        }
      : {}),
  };

  return (
    <HStack alignItems="center" style={[layout.row, layout.itemsStretch, gutters.paddingV_18]}>
      {shouldShowBackButton && (
        <Button
          style={[layout.row, layout.itemsCenter, gutters.paddingR_6]}
          type="native"
          onPress={() => navigator.back()}
          testID="button_Back"
        >
          <Icons.ChevronLeftIcon size={15} color={colors.gray600} />
          <Text style={[gutters.marginL_6, fonts.size_15, fonts.medium, fonts.gray600]}>Back</Text>
        </Button>
      )}
      {renderCenter && <Box style={[layout.flex_1, inlineCenterStyles]}>{renderCenter()}</Box>}
      {renderAfter && renderAfter()}
    </HStack>
  );
}

export default NavbarWrapper;
