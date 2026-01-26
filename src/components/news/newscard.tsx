// components/newscard.tsx
import { Box, Image, Text, Link, Stack, Center } from '@chakra-ui/react';

interface NewsCardProps {
  title: string;
  date: string;
  image: string;
  alt?: string;
  description?: string;
  linkUrl?: string;
  linkText?: string;
}

const NewsCard = ({
  title,
  date,
  image,
  alt = title,
  description = 'Краткое описание новости',
  linkUrl = '#',
  linkText = 'Подробнее',
}: NewsCardProps) => {
  return (
    <Center
      p={5}
      borderRadius="10px"
      boxShadow="sm"
      borderColor="gray.100"
      _hover={{
        boxShadow: '2xl',
        transition: 'box-shadow 0.3s ease-in-out',
      }}
    >
      <Stack w={200}>
        <Text fontSize={20} fontWeight="semibold">
          {title}
        </Text>
        <Text fontSize={16} color="gray.500">
          {date}
        </Text>

        <Center>
          <Image
            src={image}
            alt={alt}
            w="100%"
            h="150px"
            objectFit="cover"
            borderRadius="md"
          />
        </Center>

        <Text fontSize={16} textAlign="justify">
          {description}
        </Text>
        <Link
          href={linkUrl}
          fontSize={16}
          color="blue.500"
          textDecoration="underline"
          _hover={{ color: 'blue.600', textDecoration: 'none' }}
        >
          {linkText}
        </Link>
      </Stack>
    </Center>
  );
};

export default NewsCard;
