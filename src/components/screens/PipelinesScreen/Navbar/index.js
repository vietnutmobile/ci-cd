import { Text } from '@/components/atoms';
import NavbarWrapper from '@/components/modules/NavbarWrapper';
import useNavigator from '@/helpers/hooks/use-navigation';
import { useTheme } from '@/theme';

function PipelinesScreenNavbar({ navigation }) {
  const navigator = useNavigator();
  const { layout, gutters, fonts, colors, borders, effects, backgrounds } = useTheme();

  return (
    <NavbarWrapper
      renderCenter={() => <Text style={[fonts.size_20, fonts.semi]}>Pipelines</Text>}
    />
  );
}

export default PipelinesScreenNavbar;
