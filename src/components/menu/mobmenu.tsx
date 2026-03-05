'use client';

import {
  Box,
  Button,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTrigger,
  IconButton,
  VStack,
  Text,
  Separator,
} from '@chakra-ui/react';
import { LuMenu, LuChevronRight, LuChevronDown } from 'react-icons/lu';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Импортируем типы и данные (предполагается, что они экспортируются из HeaderMenu)
import {
  STATIC_TEAMS_MENU,
  STATIC_MENUS,
  MenuItemType,
  NavItem,
} from './headermenu';

// Компонент пункта меню в мобильной версии
const MobileMenuItem: React.FC<{
  title: string;
  href?: string;
  children?: MenuItemType[];
  level?: number;
  onClose: () => void;
}> = ({ title, href, children, level = 0, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const hasChildren = children && children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else if (href) {
      router.push(href);
      onClose();
    }
  };

  return (
    <Box w="100%">
      {/* Заголовок пункта меню */}
      <Box
        onClick={handleClick}
        cursor="pointer"
        py={3}
        px={4}
        pl={level > 0 ? 4 + level * 4 : 4}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        _hover={{ bg: 'gray.50' }}
        borderRadius="md"
      >
        <Text
          fontSize={level === 0 ? 'lg' : 'md'}
          fontWeight={level === 0 ? 'medium' : 'normal'}
        >
          {title}
        </Text>
        {hasChildren && (
          <Box color="gray.500">
            {isOpen ? (
              <LuChevronDown size={20} />
            ) : (
              <LuChevronRight size={20} />
            )}
          </Box>
        )}
      </Box>

      {/* Дочерние пункты */}
      {hasChildren && isOpen && (
        <VStack align="start" w="100%">
          {children.map((child, index) => (
            <MobileMenuItem
              key={index}
              title={child.title}
              href={child.href}
              children={child.children}
              level={level + 1}
              onClose={onClose}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
};

// Компонент мобильного меню
const MobMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Общедоступные пункты меню
  const publicMenuItems: (NavItem | { title: string; href: string })[] = [
    { title: 'Главная', href: '/' },
    STATIC_TEAMS_MENU as NavItem,
    STATIC_MENUS.documents as NavItem,
    STATIC_MENUS.security as NavItem,
    STATIC_MENUS.contact as NavItem,
    { title: 'Галерея', href: '/gallery' },
  ];

  // Админские пункты
  const adminMenuItems = [
    { title: 'Добавление события (Афиши)', href: '/addevent' },
    { title: 'Добавление новости', href: '/addnews' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
    setOpen(false);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <DrawerRoot open={open} onOpenChange={e => setOpen(e.open)}>
      {/* Бэкдроп (затемнение фона) */}
      <DrawerBackdrop />

      {/* Кнопка-триггер для открытия меню */}
      <DrawerTrigger asChild>
        <IconButton
          aria-label="Открыть меню"
          variant="ghost"
          size="lg"
          display={{ base: 'flex', md: 'none' }}
        >
          <LuMenu size={24} />
        </IconButton>
      </DrawerTrigger>

      {/* Контент Drawer */}
      <DrawerContent rounded="l3" bg="white" maxW="300px">
        {/* Заголовок с кнопкой закрытия */}
        <DrawerHeader>
          <Text fontSize="xl" fontWeight="bold" p={4}>
            Меню
          </Text>
          <DrawerCloseTrigger />
        </DrawerHeader>

        {/* Тело меню */}
        <DrawerBody p={0}>
          <VStack align="start" w="100%">
            {/* Основные пункты */}
            {publicMenuItems.map((item, index) => {
              if ('children' in item && item.children) {
                return (
                  <MobileMenuItem
                    key={index}
                    title={item.title}
                    href={item.href}
                    children={item.children}
                    onClose={() => setOpen(false)}
                  />
                );
              }

              // Пункты без дочерних элементов
              return (
                <Box
                  key={index}
                  w="100%"
                  py={3}
                  px={4}
                  cursor="pointer"
                  onClick={() =>
                    'href' in item && item.href && handleNavigation(item.href)
                  }
                  _hover={{ bg: 'gray.50' }}
                >
                  <Text fontSize="lg">{item.title}</Text>
                </Box>
              );
            })}

            {/* Админские пункты */}
            {isAuthenticated && (
              <>
                {adminMenuItems.map((item, index) => (
                  <Box
                    key={`admin-${index}`}
                    w="100%"
                    py={3}
                    px={4}
                    cursor="pointer"
                    onClick={() => handleNavigation(item.href)}
                    _hover={{ bg: 'gray.50' }}
                  >
                    <Text fontSize="md" color="blue.600">
                      {item.title}
                    </Text>
                  </Box>
                ))}
              </>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default MobMenu;
