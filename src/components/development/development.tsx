import { HStack, Link, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const Development = () => {
  const router = useRouter();
  return (
    <Stack
      width="100%"
      justify="space-between"
      pb={10}
      px={{ base: '5', md: 20 }}
      color="blackAlpha.500"
      direction={{ base: 'column', md: 'row' }}
    >
      <Link
        onClick={() => {
          router.push('/personalpolicy');
        }}
      >
        <Text
          _hover={{
            textDecoration: 'none',
            color: 'blue.600',
          }}
        >
          Политика обработки персональных данных
        </Text>
      </Link>
      <Link href="mailto:vadim_i4@mail.ru">Место для вашей рекламы </Link>
      <Stack>
        <Link href="/">
          <Text>Development ( Vadim Ponomarev )</Text>
        </Link>
        <Link href="mailto:vadim_i4@mail.ru">
          <Text
            _hover={{
              textDecoration: 'none',
              color: 'blue.600',
            }}
          >
            Vadim_i4@mail.ru
          </Text>
        </Link>
      </Stack>
    </Stack>
  );
};

export default Development;
