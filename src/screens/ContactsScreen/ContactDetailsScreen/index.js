import { useTheme } from '@/theme';
import SafeScreen from '@/components/modules/SafeScreen';
import ContactDetailsScreenNavbar from '@/components/screens/ContactDetailsScreen/Navbar';
import { AlertDialog, Avatar, Divider, HStack, ScrollView } from 'native-base';
import { useRoute } from '@react-navigation/native';
import defaultAvatar from '@/theme/assets/images/default-avatar.jpeg';
import { Images } from '@/theme/ImageProvider';
import { Button, Link, Text } from '@/components/atoms';
import * as Icons from 'react-native-heroicons/outline';
import { extractContactDisplayName } from '@/helpers/content';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useBulkDeleteContactsMutation } from '@/store/services';
import useNavigator from '@/helpers/hooks/use-navigation';

function ContactDetailsScreen({ navigation }) {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigator = useNavigator();
  const { layout, gutters, fonts, colors, borders, backgrounds } = useTheme();

  const cancelRef = useRef(null);
  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bulkDeleteContacts] = useBulkDeleteContactsMutation();

  const { contact } = route?.params;
  const contactTags = contact?.contactTags ?? [];
  const displayName = extractContactDisplayName(contact);

  const showConfirmDeleteAlert = () => setIsAlertOpened(true);
  const hideConfirmDeleteAlert = () => setIsAlertOpened(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await bulkDeleteContacts({ ids: [contact.id] });
      hideConfirmDeleteAlert();
      setTimeout(() => {
        navigator.back();
      }, 200);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeScreen style={[backgrounds.gray50, gutters.paddingB_60]}>
      <ContactDetailsScreenNavbar />

      <HStack mb={4} justifyContent="center">
        <Avatar size={24} source={contact?.avatar ? { uri: contact?.avatar } : defaultAvatar} />
      </HStack>

      <HStack mb={4} justifyContent="center" space={2}>
        <Button
          size={7}
          style={[borders.none]}
          backgroundColor="green600"
          onPress={() => {
            navigator.navigate('ContactEditScreen', { contact });
          }}
        >
          <Icons.PencilIcon size={15} color={colors.white} />
        </Button>

        <Button
          size={7}
          style={[borders._1, borders.red600]}
          backgroundColor="white"
          onPress={showConfirmDeleteAlert}
        >
          <Icons.TrashIcon size={15} color={colors.red600} />
        </Button>
      </HStack>

      <Divider my={0} bg="gray.200" />

      <ScrollView>
        <Text style={[gutters.marginV_16, fonts.size_15, fonts.semi, fonts.gray900]}>
          Contact Information
        </Text>

        <HStack mb={4} space={3} justifyContent="space-between">
          <Text style={[layout.flex_2, fonts.size_15, fonts.medium, fonts.gray900]}>Full Name</Text>

          <Text style={[layout.flex_5, fonts.right, fonts.size_15, fonts.gray900]}>
            {displayName}
          </Text>
        </HStack>

        <HStack mb={4} space={3} justifyContent="space-between">
          <Text style={[layout.flex_2, fonts.size_15, fonts.medium, fonts.gray900]}>Address</Text>

          <Text style={[layout.flex_5, fonts.right, fonts.size_15, fonts.gray900]}>
            {contact?.address ?? ''}
          </Text>
        </HStack>

        <HStack mb={4} space={3} justifyContent="space-between">
          <Text style={[layout.flex_2, fonts.size_15, fonts.medium, fonts.gray900]}>Email</Text>

          {contact?.email?.length > 0 && (
            <Link
              style={[fonts.right, fonts.size_15, fonts.green600]}
              href={`mailto:${contact.email}`}
            >
              {contact?.email ?? ''}
            </Link>
          )}
        </HStack>

        <HStack mb={4} space={3} justifyContent="space-between">
          <Text style={[layout.flex_2, fonts.size_15, fonts.medium, fonts.gray900]}>Phone</Text>

          {contact?.phone?.length > 0 && (
            <Link
              style={[fonts.right, fonts.size_15, fonts.green600]}
              href={`tel:${contact.phone}`}
            >
              {contact?.phone ?? ''}
            </Link>
          )}
        </HStack>

        <HStack mb={4} space={3} justifyContent="space-between">
          <Text style={[layout.flex_2, fonts.size_15, fonts.medium, fonts.gray900]}>Tags</Text>

          <HStack space={1.5}>
            {contactTags?.length > 0 &&
              contactTags.map((tag) => (
                <Button
                  px={1.5}
                  py={1}
                  variant="outline"
                  style={[borders._1, borders.rounded_6, borders.green600]}
                >
                  <Text style={[fonts.green600, fonts.size_10, fonts.medium]}>{tag.name}</Text>
                </Button>
              ))}
          </HStack>
        </HStack>

        <Divider my="2" bg="gray.200" />

        <Text style={[gutters.marginV_16, fonts.size_15, fonts.semi, fonts.gray900]}>Career</Text>

        <HStack mb={4} space={3} justifyContent="space-between">
          <Text style={[layout.flex_2, fonts.size_15, fonts.medium, fonts.gray900]}>
            Company name
          </Text>

          <Text style={[layout.flex_5, fonts.right, fonts.size_15, fonts.gray900]}>
            {contact?.companyName ?? ''}
          </Text>
        </HStack>

        <HStack mb={4} space={3} justifyContent="space-between">
          <Text style={[layout.flex_2, fonts.size_15, fonts.medium, fonts.gray900]}>Position</Text>

          <Text style={[layout.flex_5, fonts.right, fonts.size_15, fonts.gray900]}>
            {contact?.position ?? ''}
          </Text>
        </HStack>

        <HStack mb={4} space={3} justifyContent="space-between">
          <Text style={[layout.flex_2, fonts.size_15, fonts.medium, fonts.gray900]}>Title</Text>

          <Text style={[layout.flex_5, fonts.right, fonts.size_15, fonts.gray900]}>
            {contact?.title ?? ''}
          </Text>
        </HStack>

        <HStack mb={4} space={3} justifyContent="space-between">
          <Text style={[layout.flex_2, fonts.size_15, fonts.medium, fonts.gray900]}>Role</Text>

          <Text style={[layout.flex_5, fonts.right, fonts.size_15, fonts.gray900]}>
            {contact?.role ?? ''}
          </Text>
        </HStack>

        <Divider my={0} bg="gray.200" />

        <Text style={[gutters.marginV_16, fonts.size_15, fonts.semi, fonts.gray900]}>
          Social Links
        </Text>

        <HStack space={2}>
          {contact?.facebook?.length > 0 && (
            <Link href={contact.facebook}>
              <Images.IC_FACEBOOK width={24} height={24} />
            </Link>
          )}

          {contact?.linkedin?.length > 0 && (
            <Link href={contact.linkedin}>
              <Images.IC_LINKEDIN width={24} height={24} />
            </Link>
          )}

          {contact?.tiktok?.length > 0 && (
            <Link href={contact.tiktok}>
              <Images.IC_TIKTOK width={24} height={24} />
            </Link>
          )}
        </HStack>
      </ScrollView>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isAlertOpened}
        onClose={hideConfirmDeleteAlert}
      >
        <AlertDialog.Content>
          <AlertDialog.Header px={3} py={2}>
            <Text style={[fonts.size_14, fonts.semi, fonts.gray700]}>Delete Contact</Text>
          </AlertDialog.Header>
          <AlertDialog.Body px={3} py={4}>
            <Text style={[fonts.size_14, fonts.gray700]}>
              This contact will be deleted. This actions can not be undone. Are you sure?
            </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer px={3} py={2}>
            <HStack justifyContent="end" alignItems="center" space={2}>
              <Button
                isDiabled={isSubmitting}
                py={1.5}
                variant="unstyled"
                onPress={hideConfirmDeleteAlert}
              >
                <Text style={[fonts.size_14, fonts.semi, fonts.line_18, fonts.gray700]}>
                  Cancel
                </Text>
              </Button>
              <Button
                isDiabled={isSubmitting}
                py={1.5}
                style={[backgrounds.red500]}
                onPress={handleDelete}
              >
                <Text style={[fonts.size_14, fonts.semi, fonts.white]}>Delete</Text>
              </Button>
            </HStack>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </SafeScreen>
  );
}

export default ContactDetailsScreen;
