import { SettingProvider } from '@/context/settingContext';
import PopupLayout from '@/layout/PopupLayout';
import { ThemeAntd } from '@/theme';

function App() {
  return (
    <ThemeAntd>
      <SettingProvider>
        <PopupLayout />
      </SettingProvider>
    </ThemeAntd>
  );
}

export default App;
