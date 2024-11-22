import React, { useCallback, useState } from 'react';
import { AlertDialog, Button, HStack } from 'native-base';
import { Text } from '@/components/atoms';
import { useTheme } from '@/theme';

const useConfirmDialog = () => {
  const { layout, gutters, fonts, colors, borders, effects, backgrounds, dimensions } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [resolveReject, setResolveReject] = useState([]);
  const [resolve, reject] = resolveReject;

  const confirm = useCallback(() => {
    setIsOpen(true);
    return new Promise((resolve, reject) => {
      setResolveReject([resolve, reject]);
    });
  }, []);

  const handleClose = useCallback(
    (isConfirmed) => {
      setIsOpen(false);
      if (isConfirmed && resolve) {
        resolve(true);
      } else if (reject) {
        reject('User cancelled the action');
      }
      setResolveReject([]);
    },
    [resolve, reject],
  );

  const renderDialog = ({ title, description, ...props }) => {
    const mainCta = props?.mainCta || 'Delete';
    const secondaryCta = props?.secondaryCta || 'Cancel';

    return (
      <AlertDialog
        leastDestructiveRef={React.createRef()}
        isOpen={isOpen}
        onClose={() => handleClose(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.Header px={3} py={2}>
            <Text style={[fonts.size_14, fonts.semi, fonts.gray700]}>{title}</Text>
          </AlertDialog.Header>

          <AlertDialog.Body px={3} py={4}>
            <Text style={[fonts.size_14, fonts.gray700]}>{description}</Text>
          </AlertDialog.Body>

          <AlertDialog.Footer px={3} py={2}>
            <HStack justifyContent="end" alignItems="center" space={2}>
              <Button py={1.5} variant="unstyled" onPress={() => handleClose(false)}>
                <Text style={[fonts.size_14, fonts.semi, fonts.line_18, fonts.gray700]}>
                  {secondaryCta}
                </Text>
              </Button>

              <Button py={1.5} style={[backgrounds.red500]} onPress={() => handleClose(true)}>
                <Text style={[fonts.size_14, fonts.semi, fonts.white]}>{mainCta}</Text>
              </Button>
            </HStack>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    );
  };

  return { confirm, renderDialog };
};

export default useConfirmDialog;
