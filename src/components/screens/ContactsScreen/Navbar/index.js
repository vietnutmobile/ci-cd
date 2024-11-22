import { useTheme } from '@/theme';
import { Text } from '@/components/atoms';
import Button from '@/components/atoms/ButtonVariant';
import * as Icons from 'react-native-heroicons/outline';
import useNavigator from '@/helpers/hooks/use-navigation';
import NavbarWrapper from '@/components/modules/NavbarWrapper';

function ContactsScreenNavbar({ navigation }) {
  const navigator = useNavigator();
  const { layout, gutters, fonts, colors, borders, effects, backgrounds } = useTheme();

  return (
    <NavbarWrapper
      renderCenter={() => <Text style={[fonts.size_18, fonts.semi]}>Contacts</Text>}
      renderAfter={() => (
        <Button
          type="native"
          onPress={() => navigator.navigate('ContactCreateScreen')}
          style={[layout.row, layout.itemsCenter, layout.justifyCenter, gutters.paddingH_8]}
        >
          <Icons.UserPlusIcon size={24} color={colors.green600} />
        </Button>
      )}
    />
  );
}

export default ContactsScreenNavbar;
