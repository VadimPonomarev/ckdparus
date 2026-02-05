import { Box, HStack, Icon, Image, Link, Stack, Text } from '@chakra-ui/react';
import { FaVk } from 'react-icons/fa6';
import AccessibilityButton from '@/components/accessibility/AccessibilityButton';

const Preheader = () => {
  return (
    <Stack direction="row" h="20">
      <HStack justifyContent="space-between" w="100%">
        <Stack fontSize="18px" fontWeight="bold">
          <HStack justifyContent="start">
            <Link
              color="blue.600"
              textAlign="end"
              cursor="pointer"
              href="tel:+79019632063"
            >
              +7 901 963 20 63
            </Link>
          </HStack>
          <Text>Режим работы: 8:00-21:00</Text>
        </Stack>

        <HStack gap={5}>
          {/* Кнопка для слабовидящих */}
          <AccessibilityButton />

          <Link href="https://max.ru/id3911001237_gos" target="_blank">
            <HStack
              cursor="pointer"
              _hover={{
                '& > *': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <Image
                src="/images/max-messenger-horizontal-logo.svg"
                alt="MAX"
                h="30px"
                loading="lazy"
              />
            </HStack>
          </Link>

          <Link href="https://vk.ru/ckd_parus_sovetsk" target="_blank">
            <HStack
              cursor="pointer"
              _hover={{
                '& > *': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <Icon size="xl" color="blue.500">
                <FaVk />
              </Icon>
              <Text fontWeight="bold" fontSize="xl">
                В КОНТАКТЕ
              </Text>
            </HStack>
          </Link>
        </HStack>
      </HStack>
    </Stack>
  );
};

export default Preheader;
