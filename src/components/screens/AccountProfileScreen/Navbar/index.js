import { HStack } from 'native-base';
import { useTheme } from '@/theme';
import { Text } from '@/components/atoms';
import NavbarWrapper from '@/components/modules/NavbarWrapper';
import { useRoute } from '@react-navigation/native';

function AccountProfileScreenNavbar({ navigation }) {
  const route = useRoute();
  const { layout, gutters, fonts, colors, borders, effects, backgrounds } = useTheme();

  return (
    <NavbarWrapper shouldShowBackButton>
      <HStack style={[layout.row, layout.itemsCenter, layout.justifyCenter, gutters.paddingR_20]}>
        <Text style={[fonts.size_16, fonts.semi]}>Edit Profile</Text>
      </HStack>
    </NavbarWrapper>
  );
}

export default AccountProfileScreenNavbar;
