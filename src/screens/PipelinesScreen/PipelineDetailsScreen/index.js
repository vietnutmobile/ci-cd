import SafeScreen from '@/components/modules/SafeScreen';
import PipelineDetailsScreenNavbar from '@/components/screens/PipelineDetailsScreen/Navbar';
import StagesList from '@/components/screens/PipelineDetailsScreen/StagesList';
import { useTheme } from '@/theme';

function PipelinesScreen() {
  const { layout, backgrounds } = useTheme();

  return (
    <SafeScreen style={[backgrounds.gray100]}>
      <PipelineDetailsScreenNavbar />
      <StagesList />
    </SafeScreen>
  );
}

export default PipelinesScreen;
