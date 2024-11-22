import { useTheme } from '@/theme';
import { Text } from '@/components/atoms';
import NavbarWrapper from '@/components/modules/NavbarWrapper';

function ContactCreateScreenNavbar({ navigation }) {
  const { layout, gutters, fonts, colors, borders, effects, backgrounds } = useTheme();

  return (
    <NavbarWrapper
      shouldShowBackButton
      renderCenter={() => (
        <Text style={[fonts.size_16, fonts.semi, fonts.center]}>New Contact</Text>
      )}
    />
  );
}

export default ContactCreateScreenNavbar;
