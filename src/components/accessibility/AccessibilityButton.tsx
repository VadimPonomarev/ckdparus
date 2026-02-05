'use client';

import { Button, Icon, Text } from '@chakra-ui/react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const AccessibilityButton = () => {
  const { settings, toggleActive } = useAccessibility();

  return (
    <Button
      onClick={toggleActive}
      px={10}
      colorPalette={settings.isActive ? 'green' : 'blue'}
      variant={settings.isActive ? 'solid' : 'outline'}
      size="sm"
      _hover={{
        bg: settings.isActive ? 'green.50' : 'blue.50',
        transform: 'translateY(-2px)',
        boxShadow: 'md',
        color: 'blackAlpha.900',
      }}
      _active={{
        transform: 'translateY(0)',
      }}
      transition="all 0.2s ease"
      aria-label={
        settings.isActive
          ? 'Отключить версию для слабовидящих'
          : 'Включить версию для слабовидящих'
      }
      title={
        settings.isActive ? 'Обычная версия сайта' : 'Версия для слабовидящих'
      }
    >
      <Text fontSize="sm" fontWeight="medium">
        {settings.isActive ? 'Обычная версия' : 'Для слабовидящих'}
      </Text>
    </Button>
  );
};

export default AccessibilityButton;
