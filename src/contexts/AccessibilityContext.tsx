'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

// Типы настроек
export type ColorTheme =
  | 'default'
  | 'black-white'
  | 'blue-yellow'
  | 'brown-beige'
  | 'green-brown';
export type FontSize = 'normal' | 'medium' | 'large' | 'xlarge';
export type LineHeight = 'normal' | 'medium' | 'large';
export type LetterSpacing = 'normal' | 'medium' | 'large';
export type ImageMode = 'show' | 'hide' | 'grayscale';
export type FontFamily = 'default' | 'arial' | 'times';

interface AccessibilitySettings {
  isActive: boolean;
  colorTheme: ColorTheme;
  fontSize: FontSize;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
  imageMode: ImageMode;
  fontFamily: FontFamily;
  underlineLinks: boolean;
  highlightFocus: boolean;
  speechEnabled: boolean;
  isSpeaking: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  toggleActive: () => void;
  setColorTheme: (theme: ColorTheme) => void;
  setFontSize: (size: FontSize) => void;
  setLineHeight: (height: LineHeight) => void;
  setLetterSpacing: (spacing: LetterSpacing) => void;
  setImageMode: (mode: ImageMode) => void;
  setFontFamily: (font: FontFamily) => void;
  toggleUnderlineLinks: () => void;
  toggleHighlightFocus: () => void;
  toggleSpeech: () => void;
  speakText: (text: string) => void;
  stopSpeech: () => void;
  resetSettings: () => void;
}

// Начальные настройки
const defaultSettings: AccessibilitySettings = {
  isActive: false,
  colorTheme: 'default',
  fontSize: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  imageMode: 'show',
  fontFamily: 'default',
  underlineLinks: true,
  highlightFocus: true,
  speechEnabled: false,
  isSpeaking: false,
};

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      'useAccessibility must be used within AccessibilityProvider'
    );
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Загружаем из localStorage при инициализации
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accessibility-settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    }
    return defaultSettings;
  });

  // Сохраняем настройки в localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Применяем стили к body
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const styleId = 'accessibility-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Генерируем CSS на основе настроек
    const css = generateAccessibilityCSS(settings);
    styleElement.textContent = css;

    // Применяем классы к body
    const body = document.body;

    // Удаляем старые классы
    body.classList.remove(
      'accessibility-active',
      'theme-default',
      'theme-black-white',
      'theme-blue-yellow',
      'theme-brown-beige',
      'theme-green-brown',
      'font-arial',
      'font-times',
      'links-underlined',
      'focus-highlighted'
    );

    // Добавляем новые классы
    if (settings.isActive) {
      body.classList.add('accessibility-active');
      body.classList.add(`theme-${settings.colorTheme}`);

      if (settings.fontFamily !== 'default') {
        body.classList.add(`font-${settings.fontFamily}`);
      }

      if (settings.underlineLinks) {
        body.classList.add('links-underlined');
      }

      if (settings.highlightFocus) {
        body.classList.add('focus-highlighted');
      }
    }

    // Применяем data-атрибуты для изображений
    document.querySelectorAll('img').forEach(img => {
      if (settings.isActive && settings.imageMode === 'grayscale') {
        img.style.filter = 'grayscale(100%)';
      } else if (settings.isActive && settings.imageMode === 'hide') {
        img.style.display = 'none';
      } else {
        img.style.filter = '';
        img.style.display = '';
      }
    });
  }, [settings]);

  const toggleActive = () => {
    setSettings(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const setColorTheme = (theme: ColorTheme) => {
    setSettings(prev => ({ ...prev, colorTheme: theme }));
  };

  const setFontSize = (size: FontSize) => {
    setSettings(prev => ({ ...prev, fontSize: size }));
  };

  const setLineHeight = (height: LineHeight) => {
    setSettings(prev => ({ ...prev, lineHeight: height }));
  };

  const setLetterSpacing = (spacing: LetterSpacing) => {
    setSettings(prev => ({ ...prev, letterSpacing: spacing }));
  };

  const setImageMode = (mode: ImageMode) => {
    setSettings(prev => ({ ...prev, imageMode: mode }));
  };

  const setFontFamily = (font: FontFamily) => {
    setSettings(prev => ({ ...prev, fontFamily: font }));
  };

  const toggleUnderlineLinks = () => {
    setSettings(prev => ({ ...prev, underlineLinks: !prev.underlineLinks }));
  };

  const toggleHighlightFocus = () => {
    setSettings(prev => ({ ...prev, highlightFocus: !prev.highlightFocus }));
  };

  const toggleSpeech = () => {
    setSettings(prev => ({ ...prev, speechEnabled: !prev.speechEnabled }));
  };

  const speakText = (text: string) => {
    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      settings.speechEnabled
    ) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.8;

      utterance.onstart = () => {
        setSettings(prev => ({ ...prev, isSpeaking: true }));
      };

      utterance.onend = utterance.onerror = () => {
        setSettings(prev => ({ ...prev, isSpeaking: false }));
      };

      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      setSettings(prev => ({ ...prev, isSpeaking: false }));
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        toggleActive,
        setColorTheme,
        setFontSize,
        setLineHeight,
        setLetterSpacing,
        setImageMode,
        setFontFamily,
        toggleUnderlineLinks,
        toggleHighlightFocus,
        toggleSpeech,
        speakText,
        stopSpeech,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

// Функция для генерации CSS
const generateAccessibilityCSS = (settings: AccessibilitySettings): string => {
  if (!settings.isActive) return '';

  const fontSizeMap = {
    normal: '16px',
    medium: '20px',
    large: '24px',
    xlarge: '28px',
  };

  const lineHeightMap = {
    normal: '1.5',
    medium: '2.0',
    large: '2.5',
  };

  const letterSpacingMap = {
    normal: 'normal',
    medium: '0.05em',
    large: '0.1em',
  };

  const themeColors = {
    default: {},
    'black-white': {
      '--color-bg': '#FFFFFF',
      '--color-text': '#000000',
      '--color-primary': '#000000',
      '--color-secondary': '#333333',
    },
    'blue-yellow': {
      '--color-bg': '#FFFF00',
      '--color-text': '#0000FF',
      '--color-primary': '#0000FF',
      '--color-secondary': '#000088',
    },
    'brown-beige': {
      '--color-bg': '#F5F5DC',
      '--color-text': '#8B4513',
      '--color-primary': '#8B4513',
      '--color-secondary': '#A0522D',
    },
    'green-brown': {
      '--color-bg': '#D2B48C',
      '--color-text': '#006400',
      '--color-primary': '#006400',
      '--color-secondary': '#228B22',
    },
  };

  const theme = themeColors[settings.colorTheme];
  const themeVars = Object.entries(theme)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');

  return `
    :root {
      ${themeVars}
    }
    
    .accessibility-active {
      font-size: ${fontSizeMap[settings.fontSize]} !important;
      line-height: ${lineHeightMap[settings.lineHeight]} !important;
      letter-spacing: ${letterSpacingMap[settings.letterSpacing]} !important;
    }
    
    .accessibility-active.font-arial {
      font-family: Arial, sans-serif !important;
    }
    
    .accessibility-active.font-times {
      font-family: "Times New Roman", Times, serif !important;
    }
    
    .accessibility-active.links-underlined a {
      text-decoration: underline !important;
      text-decoration-thickness: 2px !important;
    }
    
    .accessibility-active.focus-highlighted :focus {
      outline: 3px solid #FF0000 !important;
      outline-offset: 2px !important;
    }
    
    .accessibility-active * {
      transition: all 0.3s ease !important;
    }
  `;
};
