import { View } from 'react-native';
import { useTheme } from '@/theme';
import SafeScreen from '@/components/modules/SafeScreen';
import { Text } from '@/components/atoms';
import { colors } from '@/theme/colors';

function StageDetailsScreen({ navigation }) {
  const { layout, fonts } = useTheme();

  return (
    <SafeScreen>
      <View style={[layout.flex_1, layout.col, layout.itemsCenter, layout.justifyCenter]}>
        <Text style={[fonts.size_18, colors.green_600]}>StageDetailsScreen</Text>
      </View>
    </SafeScreen>
  );
}

export default StageDetailsScreen;
