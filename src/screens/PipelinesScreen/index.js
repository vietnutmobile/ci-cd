import { useTheme } from '@/theme';
import SafeScreen from '@/components/modules/SafeScreen';
import PipelinesScreenNavbar from '@/components/screens/PipelinesScreen/Navbar';
import PipelinesList from '@/components/screens/PipelinesScreen/PipelinesList';

function PipelinesScreen() {
  const { layout, fonts } = useTheme();

  return (
    <SafeScreen safeAreaBottom={false}>
      <PipelinesScreenNavbar />
      <PipelinesList />
    </SafeScreen>
  );
}

export default PipelinesScreen;
