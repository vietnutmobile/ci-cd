import React, { useState } from 'react';
import { LayoutAnimation, Platform, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { HStack } from 'native-base';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Accordion = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <HStack>
      <TouchableOpacity onPress={toggleExpand}>
        <Text>{title}</Text>
      </TouchableOpacity>
      {expanded && <View>{children}</View>}
    </HStack>
  );
};

export default Accordion;
