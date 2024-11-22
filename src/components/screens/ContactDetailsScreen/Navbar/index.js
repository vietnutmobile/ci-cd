import { useTheme } from '@/theme';
import { Text } from '@/components/atoms';
import NavbarWrapper from '@/components/modules/NavbarWrapper';
import { useRoute } from '@react-navigation/native';
import { extractContactDisplayName } from '@/helpers/content';

function ContactDetailsScreenNavbar({ navigation }) {
  const route = useRoute();
  const { layout, gutters, fonts, colors, borders, effects, backgrounds } = useTheme();

  const { contact } = route?.params;
  const displayName = extractContactDisplayName(contact);

  return (
    <NavbarWrapper
      shouldShowBackButton
      renderCenter={() => (
        <Text style={[fonts.size_16, fonts.semi, fonts.center]}>{displayName}</Text>
      )}
    />
  );
}

export default ContactDetailsScreenNavbar;
