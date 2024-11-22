import { Text } from '@/components/atoms';
import NavbarWrapper from '@/components/modules/NavbarWrapper';
import useNavigator from '@/helpers/hooks/use-navigation';
import { useGetNutByIdQuery } from '@/store/services';
import { useTheme } from '@/theme';
import { useRoute } from '@react-navigation/native';

function NutDetailsScreenNavbar({ navigation }) {
  const route = useRoute();
  const navigator = useNavigator();

  const { layout, gutters, fonts, colors, borders, effects, backgrounds } = useTheme();

  const { nutId } = route?.params;

  const { data: nut } = useGetNutByIdQuery(
    {
      id: nutId,
    },
    {
      skip: !nutId,
    },
  );

  const nutName = nut?.name ?? '';

  return (
    <>
      <NavbarWrapper shouldShowBackButton shouldPadEnd={false} />
      <Text style={[gutters.marginB_16, fonts.size_16_150, fonts.medium]}>{nutName.trim()}</Text>
    </>
  );
}

export default NutDetailsScreenNavbar;
