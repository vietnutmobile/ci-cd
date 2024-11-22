import SafeScreen from '@/components/modules/SafeScreen';
import ContactsList from '@/components/screens/ContactsScreen/ContactsList';
import ContactsScreenNavbar from '@/components/screens/ContactsScreen/Navbar';
import { useTheme } from '@/theme';

function ContactDetailsScreen({ navigation }) {
  const { layout, gutters, fonts, colors, borders, backgrounds } = useTheme();

  return (
    <SafeScreen safeAreaBottom={false} style={[backgrounds.gray100]}>
      <ContactsScreenNavbar />
      <ContactsList />
    </SafeScreen>
  );
}

export default ContactDetailsScreen;
