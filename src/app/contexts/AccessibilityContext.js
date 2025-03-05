"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility deve ser usado dentro de um AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    highContrast: false,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);

        applySettings(parsedSettings);
      } catch (error) {
        console.error('Erro ao carregar configurações de acessibilidade:', error);
      }
    }
  }, []);

  const applySettings = (newSettings) => {
    if (newSettings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));

    applySettings(newSettings);
  };

  const resetSettings = () => {
    const defaultSettings = {
      highContrast: false,
    };

    setSettings(defaultSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(defaultSettings));
    applySettings(defaultSettings);
  };

  const value = {
    settings,
    updateSetting,
    resetSettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
