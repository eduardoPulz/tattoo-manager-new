"use client";

import { Navigation } from '../components/navigation/Navigation';
import { useAccessibility } from '../contexts/AccessibilityContext';
import {
  AccessibilityContainer,
  AccessibilityContent,
  AccessibilityHeader,
  OptionContainer,
  OptionTitle,
  OptionDescription,
  ToggleSwitch,
  ToggleSlider,
  ResetButton,
  SectionTitle,
} from './styles';

const AcessibilidadePage = () => {
  const { settings, updateSetting, resetSettings } = useAccessibility();

  return (
    <AccessibilityContainer>
      <Navigation />
      <AccessibilityContent>
        <AccessibilityHeader>Configurações de Acessibilidade</AccessibilityHeader>
        
        <SectionTitle>Aparência</SectionTitle>
        
        <OptionContainer>
          <div>
            <OptionTitle>Alto Contraste</OptionTitle>
            <OptionDescription>
              Aumenta o contraste das cores para melhorar a legibilidade.
            </OptionDescription>
          </div>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSetting('highContrast', e.target.checked)}
              id="high-contrast-toggle"
            />
            <ToggleSlider />
          </ToggleSwitch>
        </OptionContainer>
        
        <ResetButton onClick={resetSettings}>
          Redefinir Configurações
        </ResetButton>
      </AccessibilityContent>
    </AccessibilityContainer>
  );
};

export default AcessibilidadePage;
