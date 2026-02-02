import { Box, HStack, Text } from '@chakra-ui/react';
import Development from '../development/development';

const Footer = () => {
  return (
    <Box width="100%" bgColor="gray.200" pt={2}>
      <Development />
    </Box>
  );
};

export default Footer;
