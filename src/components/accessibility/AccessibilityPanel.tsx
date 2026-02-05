'use client';

import {
  Box,
  Stack,
  Heading,
  Text,
  Button,
  Icon,
  RadioGroup,
  Checkbox,
  HStack,
  Badge,
  Portal,
  IconButton,
  createListCollection,
  For,
  Select,
} from '@chakra-ui/react';
import {
  FaEye,
  FaFont,
  FaPalette,
  FaImage,
  FaTextHeight,
  FaTextWidth,
  FaUnderline,
  FaChevronRight,
  FaChevronLeft,
} from 'react-icons/fa6';
import { useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import {
  ColorTheme,
  FontSize,
  LineHeight,
  LetterSpacing,
  ImageMode,
  FontFamily,
} from '@/contexts/AccessibilityContext';

const AccessibilityPanel = () => {
  const {
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
  } = useAccessibility();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!settings.isActive) return null;

  // Коллекции для RadioGroup
  const fontSizeCollection = createListCollection({
    items: [
      { label: 'Аа', value: 'normal' },
      { label: 'Аа', value: 'medium' },
      { label: 'Аа', value: 'large' },
      { label: 'Аа', value: 'xlarge' },
    ],
  });

  const colorThemeCollection = createListCollection({
    items: [
      {
        label: 'Стандарт',
        value: 'default',
        color: 'linear-gradient(to right, #3182ce, #805ad5)',
      },
      {
        label: 'Черно-белая',
        value: 'black-white',
        color: 'linear-gradient(to right, #000000, #ffffff)',
      },
      {
        label: 'Сине-желтая',
        value: 'blue-yellow',
        color: 'linear-gradient(to right, #0000ff, #ffff00)',
      },
      {
        label: 'Коричневая',
        value: 'brown-beige',
        color: 'linear-gradient(to right, #8b4513, #f5f5dc)',
      },
      {
        label: 'Зеленая',
        value: 'green-brown',
        color: 'linear-gradient(to right, #006400, #d2b48c)',
      },
    ],
  });

  const imageModeCollection = createListCollection({
    items: [
      { label: 'Показывать', value: 'show' },
      { label: 'Черно-белые', value: 'grayscale' },
      { label: 'Скрыть', value: 'hide' },
    ],
  });

  const lineHeightCollection = createListCollection({
    items: [
      { label: 'Обычный', value: 'normal' },
      { label: 'Средний', value: 'medium' },
      { label: 'Большой', value: 'large' },
    ],
  });

  const letterSpacingCollection = createListCollection({
    items: [
      { label: 'Обычный', value: 'normal' },
      { label: 'Средний', value: 'medium' },
      { label: 'Большой', value: 'large' },
    ],
  });

  const fontFamilyCollection = createListCollection({
    items: [
      { label: 'Стандартный', value: 'default' },
      { label: 'Arial', value: 'arial' },
      { label: 'Times New Roman', value: 'times' },
    ],
  });

  const handleSpeakInstruction = () => {
    const instruction = `
      Панель настроек доступности. 
      Здесь вы можете настроить: размер шрифта, цветовую схему, изображения, межстрочный интервал.
      Используйте кнопки для изменения параметров.
    `;
    speakText(instruction);
  };

  return (
    <Portal>
      {/* Основной контейнер */}
      <Box
        position="fixed"
        right={isExpanded ? '10px' : '0'}
        top="50%"
        transform="translateY(-50%)"
        zIndex="9999"
        bg="white"
        boxShadow="2xl"
        borderRadius="lg"
        border="1px solid"
        borderColor="border.subtle"
        width={isExpanded ? '500px' : '200px'}
        transition="all 0.3s ease"
        maxH="90vh"
        overflow="hidden"
      >
        {/* Кнопка свернуть/развернуть - ВНУТРИ контейнера */}
        <IconButton
          position="absolute"
          // left={isExpanded ? '-40px' : '-40px'} // Снаружи контейнера слева
          top="5px"
          left="5px"
          onClick={() => setIsExpanded(!isExpanded)}
          size="sm"
          borderRadius="full"
          colorPalette="blue"
          bg="blue.500"
          color="white"
          _hover={{ bg: 'blue.600' }}
          aria-label={isExpanded ? 'Свернуть панель' : 'Развернуть панель'}
          zIndex="10000"
        >
          <Icon as={isExpanded ? FaChevronRight : FaChevronLeft} />
        </IconButton>

        {isExpanded ? (
          <Stack px={14} maxH="80vh" overflowY="auto" py={5}>
            {/* Заголовок */}
            <Heading size="md" display="flex" alignItems="center" gap={2}>
              <Icon as={FaEye} color="blue.500" />
              Версия для слабовидящих
            </Heading>

            {/* Размер шрифта */}
            <Box>
              <Text
                fontWeight="medium"
                mb={2}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FaFont} />
                Размер шрифта
              </Text>
              <RadioGroup.Root
                value={settings.fontSize}
                onValueChange={details =>
                  setFontSize(details.value as FontSize)
                }
                display="grid"
                gridTemplateColumns="repeat(4, 1fr)"
                gap={2}
              >
                <For each={fontSizeCollection.items}>
                  {item => (
                    <RadioGroup.Item key={item.value} value={item.value}>
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemControl />
                      <RadioGroup.ItemText>
                        <Box
                          fontSize={
                            item.value === 'medium'
                              ? 'lg'
                              : item.value === 'large'
                                ? 'xl'
                                : item.value === 'xlarge'
                                  ? '2xl'
                                  : 'md'
                          }
                        >
                          {item.label}
                        </Box>
                      </RadioGroup.ItemText>
                    </RadioGroup.Item>
                  )}
                </For>
              </RadioGroup.Root>
            </Box>

            {/* Цветовая схема */}
            <Box>
              <Text
                fontWeight="medium"
                mb={2}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FaPalette} />
                Цветовая схема
              </Text>
              <HStack flexWrap="wrap">
                <RadioGroup.Root
                  value={settings.colorTheme}
                  onValueChange={details =>
                    setColorTheme(details.value as ColorTheme)
                  }
                  display="grid"
                  gridTemplateColumns="repeat(2, 1fr)"
                  gap={2}
                >
                  <For each={colorThemeCollection.items}>
                    {item => (
                      <RadioGroup.Item key={item.value} value={item.value}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemControl />
                        <RadioGroup.ItemText>
                          <Box
                            width="100%"
                            height="60px"
                            borderRadius="md"
                            background={item.color}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            border="2px solid"
                            borderColor={
                              settings.colorTheme === item.value
                                ? 'blue.500'
                                : 'transparent'
                            }
                          >
                            <Text
                              fontSize="xs"
                              color={
                                item.value === 'black-white'
                                  ? 'white'
                                  : item.value === 'blue-yellow'
                                    ? 'blue.800'
                                    : 'black'
                              }
                              textShadow="0 1px 2px rgba(0,0,0,0.3)"
                              fontWeight="bold"
                              textAlign="center"
                            >
                              {item.label}
                            </Text>
                          </Box>
                        </RadioGroup.ItemText>
                      </RadioGroup.Item>
                    )}
                  </For>
                </RadioGroup.Root>
              </HStack>
            </Box>

            {/* Изображения */}
            <Box>
              <Text
                fontWeight="medium"
                mb={2}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FaImage} />
                Изображения
              </Text>
              <RadioGroup.Root
                value={settings.imageMode}
                onValueChange={details =>
                  setImageMode(details.value as ImageMode)
                }
              >
                <HStack gap="6">
                  <For each={imageModeCollection.items}>
                    {item => (
                      <RadioGroup.Item key={item.value} value={item.value}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemControl />
                        <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    )}
                  </For>
                </HStack>
              </RadioGroup.Root>
            </Box>

            {/* Межстрочный интервал */}
            <Box>
              <Text
                fontWeight="medium"
                mb={2}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FaTextHeight} />
                Междустрочный интервал
              </Text>
              <RadioGroup.Root
                value={settings.lineHeight}
                onValueChange={details =>
                  setLineHeight(details.value as LineHeight)
                }
              >
                <HStack gap="6">
                  <For each={lineHeightCollection.items}>
                    {item => (
                      <RadioGroup.Item key={item.value} value={item.value}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemControl />
                        <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    )}
                  </For>
                </HStack>
              </RadioGroup.Root>
            </Box>

            {/* Межбуквенный интервал */}
            <Box>
              <Text
                fontWeight="medium"
                mb={2}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FaTextWidth} />
                Межбуквенный интервал
              </Text>
              <RadioGroup.Root
                value={settings.letterSpacing}
                onValueChange={details =>
                  setLetterSpacing(details.value as LetterSpacing)
                }
              >
                <HStack gap="6">
                  <For each={letterSpacingCollection.items}>
                    {item => (
                      <RadioGroup.Item key={item.value} value={item.value}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemControl />
                        <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    )}
                  </For>
                </HStack>
              </RadioGroup.Root>
            </Box>

            {/* Шрифт */}
            <Box>
              <Text fontWeight="medium" mb={2}>
                Шрифт
              </Text>
              <Select.Root
                collection={fontFamilyCollection}
                value={[settings.fontFamily]}
                onValueChange={details =>
                  setFontFamily(details.value[0] as FontFamily)
                }
                size="sm"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Выберите шрифт" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content>
                    <For each={fontFamilyCollection.items}>
                      {item => (
                        <Select.Item item={item} key={item.value}>
                          <span
                            style={{
                              fontFamily:
                                item.value === 'arial'
                                  ? 'Arial, sans-serif'
                                  : item.value === 'times'
                                    ? '"Times New Roman", serif'
                                    : 'inherit',
                            }}
                          >
                            {item.label}
                          </span>
                        </Select.Item>
                      )}
                    </For>
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            </Box>

            {/* Дополнительные настройки */}
            <Box>
              <Text fontWeight="medium" mb={3}>
                Дополнительно
              </Text>
              <Stack>
                <Checkbox.Root
                  checked={settings.underlineLinks}
                  onCheckedChange={toggleUnderlineLinks}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>
                    <HStack>
                      <Icon as={FaUnderline} />
                      <Text>Подчеркивать ссылки</Text>
                    </HStack>
                  </Checkbox.Label>
                </Checkbox.Root>

                <Checkbox.Root
                  checked={settings.highlightFocus}
                  onCheckedChange={toggleHighlightFocus}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>
                    <HStack>
                      <Text>Выделять фокус</Text>
                    </HStack>
                  </Checkbox.Label>
                </Checkbox.Root>

                <Checkbox.Root
                  checked={settings.speechEnabled}
                  onCheckedChange={toggleSpeech}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>
                    <HStack>
                      <Text>Озвучивание текста</Text>
                      {settings.speechEnabled && (
                        <Badge colorPalette="green" size="sm">
                          Вкл
                        </Badge>
                      )}
                    </HStack>
                  </Checkbox.Label>
                </Checkbox.Root>
              </Stack>
            </Box>

            {/* Кнопки управления */}
            <Stack>
              {settings.speechEnabled && (
                <Button
                  onClick={handleSpeakInstruction}
                  size="sm"
                  variant="outline"
                  colorPalette="blue"
                >
                  Озвучить подсказку
                </Button>
              )}

              <Button
                onClick={resetSettings}
                size="sm"
                variant="outline"
                colorPalette="gray"
              >
                Сбросить настройки
              </Button>

              <Button
                onClick={toggleActive}
                size="sm"
                variant="solid"
                colorPalette="red"
              >
                Обычная версия сайта
              </Button>
            </Stack>
          </Stack>
        ) : (
          // Свернутое состояние
          <Stack
            p={2}
            alignItems="center"
            pl={10}
            cursor="pointer"
            onClick={() => setIsExpanded(true)}
            _hover={{ bg: 'gray.50' }}
          >
            <Icon as={FaEye} boxSize={6} color="blue.500" />
            <Text fontSize="xs" textAlign="center" fontWeight="bold">
              Для слабовидящих
            </Text>
          </Stack>
        )}
      </Box>
    </Portal>
  );
};

export default AccessibilityPanel;
