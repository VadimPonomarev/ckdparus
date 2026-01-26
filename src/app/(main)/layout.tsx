'use client';

import { Box, Stack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Preheader from '@/components/preheader/preheader';
import Headerpicture from '@/components/headerpicture/headerpicture';
import HeaderMenu from '@/components/menu/headermenu';
import Links from '@/components/links/links';
import Development from '@/components/development/development';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      bgGradient="to-b"
      gradientFrom="blue.100"
      gradientTo="white"
      minH="100vh"
    >
      <Box minH="100vh" mx={20}>
        <Preheader />
        <Stack gap={10}>
          <Headerpicture />

          <Box
            position="sticky"
            top="0"
            zIndex="1000"
            transition="all 0.3s ease"
            boxShadow={isScrolled ? 'lg' : 'sm'}
            bg="blue.100"
            transform={isScrolled ? 'translateY(0)' : 'translateY(0)'}
            _hover={{
              boxShadow: 'xl',
            }}
          >
            <HeaderMenu />
          </Box>

          {children}

          <Links />
          <Development />
        </Stack>
      </Box>
    </Box>
  );
}
