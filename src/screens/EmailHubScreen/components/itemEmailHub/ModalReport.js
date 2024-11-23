import { Button, Text } from '@/components/atoms';
import { useReportNotSpamMutation } from '@/store/services';
import { useTheme } from '@/theme';
import { Box, HStack } from 'native-base';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { ShieldCheckIcon, XMarkIcon } from 'react-native-heroicons/outline';
import Modal from 'react-native-modal';

const ModalReport = forwardRef(({ item, selectMailboxUser, callbackSuccess }, ref) => {
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { colors, gutters, borders, fonts } = useTheme();

  const [reportNotSpam] = useReportNotSpamMutation();

  const hideModalReport = () => {
    setLoading(false);
    setShowReport(false);
    callbackSuccess?.();
  };

  useImperativeHandle(ref, () => ({
    showModalReport: () => {
      setShowReport(true);
    },
  }));

  // useEffect(() => {
  //   if (!showReport) {
  //     setSuccess(false);
  //     setError('');
  //     setLoading(false);
  //   }
  // }, [showReport]);

  const handleReport = async () => {
    try {
      setLoading(true);
      let res = await reportNotSpam({ userId: selectMailboxUser?.id, threadId: item?.id });
      console.log(res);
      if (res.data?.success) {
        setSuccess(true);
      } else {
        setError(res?.data?.message ?? 'Unknown error');
      }
    } catch (err) {
      setError(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const renderSuccess = () => {
    if (!success) return null;
    return (
      <>
        <Text style={[fonts.size_14, gutters.marginB_24]}>
          Email has been moved to Inbox. It will be auto-converted to Nut by Nutsales on next sync.
        </Text>
        <Button
          isLoading={loading}
          colorScheme="green"
          variant="outline"
          style={[borders.rounded_6, borders.green600]}
          onPress={hideModalReport}
        >
          Ok
        </Button>
      </>
    );
  };

  const renderError = () => {
    if (!error) return null;
    return <Text style={[fonts.size_14, gutters.marginB_24]}>{error}</Text>;
  };

  const renderContent = () => {
    if (success || error) return null;
    return (
      <>
        <Text style={[fonts.size_14, gutters.marginB_24]}>
          Are you sure you want to report this email as not spam?
        </Text>

        <Button
          isLoading={loading}
          leftIcon={<ShieldCheckIcon size={18} color={colors.white} />}
          colorScheme="green"
          style={[borders.rounded_6]}
          onPress={handleReport}
        >
          <Text style={[fonts.size_15, fonts.bold, fonts.white]}>Report Not Spam</Text>
        </Button>
      </>
    );
  };

  return (
    <Modal
      isVisible={showReport}
      onRequestClose={hideModalReport}
      useNativeDriver
      hideModalContentWhileAnimating
      animationIn="zoomIn"
      animationOut="zoomOut"
    >
      <Box bg={colors.white} style={[borders.rounded_6, gutters.padding_16]}>
        <HStack alignItems="center" justifyContent="space-between" style={[gutters.marginB_18]}>
          <Text style={[fonts.size_16, fonts.medium]}>Report Not Spam</Text>
          <Button type="native" onPress={hideModalReport}>
            <XMarkIcon size={24} color={colors.gray500} />
          </Button>
        </HStack>
        {renderSuccess()}
        {renderError()}
        {renderContent()}
      </Box>
    </Modal>
  );
});

export default ModalReport;
