import {
  Center,
  HStack,
  Image,
  Link,
  Stack,
  Text,
  ImageProps,
} from '@chakra-ui/react';

// Типы для пропсов
interface PosterCardProps {
  title: string;
  date: string;
  image: string;
  alt?: string;
  description?: string;
  linkUrl?: string;
  linkText?: string;
  imageProps?: ImageProps;
  className?: string;
}

const PosterCard: React.FC<PosterCardProps> = ({
  title,
  date,
  image,
  alt = title,
  description = 'Краткое описание мероприятия',
  linkUrl = '#',
  linkText = 'Подробнее',
  imageProps,
}) => {
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
            {...imageProps}
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

export default PosterCard;
