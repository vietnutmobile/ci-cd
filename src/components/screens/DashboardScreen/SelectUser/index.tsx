import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { XMarkIcon, UserIcon, CheckIcon, ChevronDownIcon } from 'react-native-heroicons/outline';

import { Text } from '@/components/atoms';
import { useTheme } from '@/theme';
import { Avatar } from 'native-base';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface SelectUserProps {
  initialUsers: User[];
  users: User[];
  onSelectUsers: (users: User[]) => void;
  maxSelect?: number; // Optional: giới hạn số lượng user có thể chọn
}

const SelectUser = ({ users, onSelectUsers, maxSelect, initialUsers = [] }: SelectUserProps) => {
  const insets = useSafeAreaInsets();
  const { fonts, borders, colors } = useTheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>(initialUsers);
  const [confirmUsers, setConfirmUsers] = useState<User[]>(initialUsers);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSelectUser = (user: User) => {
    let newSelectedUsers: User[];

    if (selectedUsers.some((selected) => selected.id === user.id)) {
      newSelectedUsers = selectedUsers.filter((selected) => selected.id !== user.id);
    } else {
      if (maxSelect && selectedUsers.length >= maxSelect) {
        return;
      }
      newSelectedUsers = [...selectedUsers, user];
    }

    setSelectedUsers(newSelectedUsers);
    onSelectUsers(newSelectedUsers);
  };

  const handleConfirm = () => {
    setConfirmUsers(selectedUsers);
    onSelectUsers(selectedUsers);
    toggleModal();
  };

  const handleClear = () => {
    setSelectedUsers([]);
    setConfirmUsers([]);
    onSelectUsers([]);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => handleSelectUser(item)}>
      <View style={styles.userInfo}>
        {item.avatar ? (
          <Avatar source={{ uri: item.avatar }} size={10} mr={2} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <UserIcon size={24} color={colors.gray500} />
          </View>
        )}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[fonts.size_14, fonts.gray900, styles.userName]}
        >
          {item.name}
        </Text>
      </View>
      {selectedUsers.some((selected) => selected.id === item.id) && (
        <CheckIcon size={24} color={colors.green500} />
      )}
    </TouchableOpacity>
  );

  const disabledButton = selectedUsers.length === 0;

  return (
    <View>
      <TouchableOpacity onPress={toggleModal} style={[styles.button, borders.gray300]}>
        <Text style={[fonts.size_14, confirmUsers.length > 0 ? fonts.gray900 : fonts.gray400]}>
          {confirmUsers.length > 0 ? `Selected (${confirmUsers.length})` : 'Select users'}
        </Text>
        <ChevronDownIcon size={20} color={colors.gray500} />
      </TouchableOpacity>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} style={styles.modal}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[fonts.size_16, fonts.gray900, fonts.bold]}>Select Users</Text>
            <TouchableOpacity onPress={toggleModal}>
              <XMarkIcon size={24} color={colors.gray500} />
            </TouchableOpacity>
          </View>

          {/* User List */}
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            style={styles.userList}
            ListFooterComponent={<View style={{ height: 40 }} />}
          />

          {/* Footer with Confirm Button */}
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
                Confirm {selectedUsers.length ? `(${selectedUsers.length})` : ''}
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userList: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    marginLeft: 12,
  },
  selectedCount: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    gap: 12,
  },
  buttonAction: {
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
  },
  btConfirm: {
    borderColor: '#00864E',
    backgroundColor: '#FFFFFF',
  },
  btClear: {
    borderColor: '#EF4444',
    backgroundColor: '#FFFFFF',
  },
});

export default SelectUser;
