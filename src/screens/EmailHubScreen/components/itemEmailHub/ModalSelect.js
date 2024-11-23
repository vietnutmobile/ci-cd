import { Text } from '@/components/atoms';
import { useTheme } from '@/theme';
import { Box, HStack, ScrollView } from 'native-base';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckIcon, ChevronDownIcon, XMarkIcon } from 'react-native-heroicons/outline';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

const ModalSelect = ({ data = [], onSelect, title = '', placeholder = 'Select value', value }) => {
  const { colors, gutters, borders, fonts, layout } = useTheme();

  const [show, setShow] = useState(false);
  const [active, setActive] = useState();

  const hideModal = () => setShow(false);
  const showModal = () => setShow(true);

  useEffect(() => {
    if ((value && active && active?.id !== value) || (value && data.length && !active)) {
      setActive(data.find((item) => item.id === value));
    }
    if (!value) {
      setActive();
    }
  }, [value]);

  const handleSelect = (item) => {
    if (active?.id === item?.id) return;
    setActive(item);
    setTimeout(() => {
      hideModal();
      onSelect(item);
    }, 300);
  };

  const calculateHeight = () => {
    let height = data.length * 40 + 100;
    const maxHeight = (Dimensions.get('window').height - 100) * 0.7;
    if (height > maxHeight) {
      height = maxHeight;
    }
    return height;
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.selectPipeline, borders._1, borders.gray300, borders.rounded_6]}
        onPress={showModal}
      >
        <Text style={[layout.flex_1, { color: active?.name ? colors.black : colors.gray500 }]}>
          {active?.name || placeholder}
        </Text>
        <ChevronDownIcon size={24} color={colors.gray500} />
      </TouchableOpacity>
      <Modal
        style={styles.modalPipeline}
        isVisible={show}
        onRequestClose={hideModal}
        onBackdropPress={hideModal}
        useNativeDriver
        hideModalContentWhileAnimating
      >
        <Box
          bg={colors.white}
          style={[borders.rounded_16, gutters.padding_16, { height: calculateHeight() }]}
        >
          <SafeAreaView edges={['bottom']}>
            <HStack justifyContent="space-between" alignItems="center" style={[gutters.marginB_12]}>
              <Text style={[fonts.size_16, fonts.medium]}>{title}</Text>
              <TouchableOpacity onPress={hideModal}>
                <XMarkIcon size={24} color={colors.gray500} />
              </TouchableOpacity>
            </HStack>
            <ScrollView>
              {data.map((item) => {
                const isActive = active?.id === item?.id;
                return (
                  <TouchableOpacity
                    key={item?.id}
                    style={[
                      layout.row,
                      gutters.paddingH_12,
                      gutters.paddingV_10,
                      borders.rounded_6,
                      layout.itemsCenter,
                      {
                        backgroundColor: isActive ? colors.gray100 : colors.white,
                        height: 40,
                      },
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text
                      style={[
                        fonts.size_15,
                        { color: isActive ? colors.green600 : colors.black, flex: 1 },
                      ]}
                    >
                      {item?.name}
                    </Text>
                    {isActive ? <CheckIcon size={24} color={colors.green600} /> : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </Box>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalPipeline: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  selectPipeline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
});

export default ModalSelect;
