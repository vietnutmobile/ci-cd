import { useTheme } from '@/theme';
import { Text } from '@/components/atoms';
import useNavigator from '@/helpers/hooks/use-navigation';
import NavbarWrapper from '@/components/modules/NavbarWrapper';
import { useRoute } from '@react-navigation/native';
import Button from '../../../atoms/ButtonVariant';
import * as Icons from 'react-native-heroicons/outline';

function PipelineDetailsScreenNavbar({ navigation }) {
  const navigator = useNavigator();
  const route = useRoute();

  const { layout, gutters, fonts, colors, borders, effects, backgrounds } = useTheme();

  const { pipeline } = route.params;

  return (
    <NavbarWrapper
      shouldShowBackButton
      renderCenter={() => (
        <Text style={[fonts.size_18, fonts.semi, fonts.center]}>{pipeline?.name ?? ''}</Text>
      )}
      renderAfter={() => (
        <Button
          type="native"
          onPress={() =>
            navigator.navigate('NutCreateScreen', {
              pipeline,
            })
          }
          style={[layout.row, layout.itemsCenter, layout.justifyCenter, gutters.paddingH_8]}
        >
          <Text style={[fonts.size_15, fonts.green600, gutters.marginR_4]}>Nut</Text>
          <Icons.PlusIcon size={18} color={colors.green600} />
        </Button>
      )}
    />
  );
}

export default PipelineDetailsScreenNavbar;
