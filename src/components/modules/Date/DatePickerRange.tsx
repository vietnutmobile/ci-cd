/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import { CalendarIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms';
import dayjs from 'dayjs';
import { useTheme } from '@/theme';

interface DateRange {
  startDate?: DateType;
  endDate?: DateType;
}

type DatePickerRangeProps = {
  onChange: (data: DateRange) => void;
  value?: DateRange;
};

const DatePickerRange = ({ onChange, value }: DatePickerRangeProps) => {
  const { fonts, borders, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [isModalVisible, setModalVisible] = useState(false);
  const [range, setRange] = useState<DateRange>({
    startDate: value?.startDate,
    endDate: value?.endDate,
  });
  const [selectedDate, setSelectedDate] = useState<DateRange>({
    startDate: value?.startDate,
    endDate: value?.endDate,
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const isSelected = selectedDate.startDate && selectedDate.endDate;

  const handleClear = () => {
    setRange({ startDate: undefined, endDate: undefined });
    setSelectedDate({ startDate: undefined, endDate: undefined });
    onChange({
      startDate: undefined,
      endDate: undefined,
    });
  };

  const handleConfirm = () => {
    setSelectedDate({
      startDate: range.startDate,
      endDate: range.endDate,
    });
    toggleModal();
    onChange({
      startDate: range.startDate,
      endDate: range.endDate,
    });
  };

  const disabledButton = !range.startDate || !range.endDate;

  return (
    <View>
      <TouchableOpacity onPress={toggleModal} style={[styles.button, borders.gray300]}>
        <Text style={[fonts.size_14, isSelected ? fonts.gray900 : fonts.gray400]}>
          {isSelected
            ? `${dayjs(selectedDate.startDate).format('DD/MM/YYYY')} - ${dayjs(selectedDate.endDate).format('DD/MM/YYYY')}`
            : 'Select date'}
        </Text>
        <CalendarIcon size={20} color={colors.gray500} />
      </TouchableOpacity>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} style={styles.modal}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={[fonts.size_16, fonts.gray900, fonts.bold]}>Select Date Range</Text>
            <TouchableOpacity onPress={toggleModal}>
              <XMarkIcon size={24} color={colors.gray500} />
            </TouchableOpacity>
          </View>
          <DateTimePicker
            mode="range"
            onChange={(params) => {
              setRange({
                startDate: params.startDate,
                endDate: params.endDate,
              });
            }}
            startDate={range.startDate}
            endDate={range.endDate}
            selectedItemColor={'#00864E'}
            selectedTextStyle={{
              fontWeight: 'bold',
              color: '#ffffff',
            }}
            todayContainerStyle={{
              borderWidth: 1,
              borderColor: '#00864E',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            dayContainerStyle={{
              width: 40,
              height: 40,
            }}
            todayTextStyle={{
              color: '#00864E',
            }}
            selectedRangeBackgroundColor={'#C8E6C9'}
          />

          <View style={[styles.modalFooter, { paddingBottom: insets.bottom + 4 }]}>
            <TouchableOpacity
              style={[styles.buttonAction, !disabledButton && styles.btClear]}
              onPress={handleClear}
              disabled={disabledButton}
            >
              <Text
                style={[fonts.size_14, fonts.bold, disabledButton ? fonts.gray400 : fonts.red600]}
              >
                Clear
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonAction, !disabledButton && styles.btConfirm]}
              onPress={handleConfirm}
              disabled={disabledButton}
            >
              <Text
                style={[fonts.size_14, fonts.bold, disabledButton ? fonts.gray400 : fonts.green700]}
              >
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  buttonAction: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  btClear: {},
  btConfirm: {},
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
});

export default DatePickerRange;
