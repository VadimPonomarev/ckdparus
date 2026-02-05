'use client';

import { IconButton } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface TextToSpeechProps {
  text: string;
  children?: React.ReactNode;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, children }) => {
  const { settings, speakText, stopSpeech } = useAccessibility();

  const handleClick = () => {
    if (settings.isSpeaking) {
      stopSpeech();
    } else {
      speakText(text);
    }
  };

  if (!settings.speechEnabled) return null;

  return (
    <Tooltip
      content={
        settings.isSpeaking ? 'Остановить озвучивание' : 'Озвучить текст'
      }
      positioning={{ placement: 'top' }}
    >
      <IconButton
        onClick={handleClick}
        variant="ghost"
        size="xs"
        aria-label={
          settings.isSpeaking ? 'Остановить озвучивание' : 'Озвучить текст'
        }
      >
        {children}
      </IconButton>
    </Tooltip>
  );
};

export default TextToSpeech;
