import { Box, Center, Image, Separator, Stack, Text } from '@chakra-ui/react';

const HallPlan: React.FC = () => {
  return (
    <Stack width="100%" position="relative">
      <Text fontSize="2xl" fontWeight="bold">
        План зрительского зала
      </Text>
      <Separator />
      <Center>
        <Image
          src="plan_zala.jpg"
          alt="План зрительского зала"
          objectFit="contain"
          boxShadow="xl"
          borderColor="gray.100"
          w="50%"
        />
      </Center>
    </Stack>
  );
};

export default HallPlan;
