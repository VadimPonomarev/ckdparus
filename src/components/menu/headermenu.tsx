'use client';

import { Box, HStack, Text } from '@chakra-ui/react';
import { LuChevronRight } from 'react-icons/lu';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Типы
interface TeamItem {
  name: string;
  slug: string;
  href: string;
}

interface CategoryItem {
  title: string;
  teams: TeamItem[];
}

interface MenuItem {
  title: string;
  href?: string;
  children?: MenuItem[];
}

interface NavItem {
  title: string;
  href?: string;
  children?: MenuItem[];
}

// Полные статические данные для всех коллективов
const STATIC_COLLECTIVES: CategoryItem[] = [
  {
    title: 'Хореографические коллективы',
    teams: [
      {
        name: 'Образцовый хореографический ансамбль «Луиза»',
        slug: 'luiza',
        href: '/teams/luiza',
      },
      {
        name: 'Образцовая шоу-группа «Дефиле»',
        slug: 'defile',
        href: '/teams/defile',
      },
      {
        name: 'Хореографическая студия «Ириски»',
        slug: 'iriska',
        href: '/teams/iriska',
      },
      {
        name: 'Заслуженный коллектив народного творчества, образцовый хореографический ансамбль «Славяночка»',
        slug: 'slavyanochka',
        href: '/teams/slavyanochka',
      },
      {
        name: 'Хореографическая студия «Арлекино»',
        slug: 'arlequino',
        href: '/teams/arlequino',
      },
      {
        name: 'Хореографический коллектив «Забавушки»',
        slug: 'zabavushki',
        href: '/teams/zabavushki',
      },
    ],
  },
  {
    title: 'Вокальные коллективы',
    teams: [
      {
        name: 'Фольклорный ансамбль «Зёрнышки»',
        slug: 'zernyshki',
        href: '/teams/zernyshki',
      },
      {
        name: 'Вокальный ансамбль «Веретёнце»',
        slug: 'veretenze',
        href: '/teams/veretenze',
      },
      {
        name: 'Вокальный ансамбль «Звонцы»',
        slug: 'zvontsy',
        href: '/teams/zvontsy',
      },
      {
        name: 'Народный ансамбль русской песни «Прялица»',
        slug: 'pralitsa',
        href: '/teams/pralitsa',
      },
      {
        name: 'Народная вокальная студия «Ассорти»',
        slug: 'assorti',
        href: '/teams/assorti',
      },
      {
        name: 'Народная вокальная студия',
        slug: 'vocal-studio',
        href: '/teams/vocal-studio',
      },
      {
        name: 'Народный хор ветеранов «Вдохновение»',
        slug: 'vdohnovenie',
        href: '/teams/vdohnovenie',
      },
    ],
  },
  {
    title: 'Инструментальные коллективы',
    teams: [
      {
        name: 'Народный коллектив «Оркестр русских народных инструментов имени Юрия Владимировича Никулина»',
        slug: 'orchestra-nikulin',
        href: '/teams/orchestra-nikulin',
      },
    ],
  },
  {
    title: 'Театральные коллективы',
    teams: [
      {
        name: 'Народный коллектив самодеятельного художественного творчества молодежный театр «Молодая гвардия»',
        slug: 'molodaya-gvardiya',
        href: '/teams/molodaya-gvardiya',
      },
      {
        name: 'Театральная студия «Имаго»',
        slug: 'imago',
        href: '/teams/imago',
      },
    ],
  },
  {
    title: 'Клубы по интересам',
    teams: [
      {
        name: 'Объединение турникменов «STREET WARRIORS»',
        slug: 'street-warriors',
        href: '/teams/street-warriors',
      },
      {
        name: 'Медиацентр «Первые на связи!»',
        slug: 'pervye-na-svyazi',
        href: '/teams/pervye-na-svyazi',
      },
      {
        name: 'Фотостудия «Фотосинтез»',
        slug: 'fotosintez',
        href: '/teams/fotosintez',
      },
      {
        name: 'Волонтёры культуры',
        slug: 'volontery-kultury',
        href: '/teams/volontery-kultury',
      },
    ],
  },
];

// Статические данные для меню коллективов
const STATIC_TEAMS_MENU = {
  title: 'Коллективы и Объединения',
  href: '/teams',
  children: STATIC_COLLECTIVES.map(category => ({
    title: category.title,
    children: category.teams.map(team => ({
      title: team.name,
      href: team.href,
    })),
  })),
};

// Статические данные для остальных меню
const STATIC_MENUS = {
  documents: {
    title: 'Документы',
    href: '/documents',
    children: [
      {
        title: 'Общая информация об учреждении',
        children: [
          { title: 'История', href: '/documents/history' },
          { title: 'План зрительного зала', href: '/documents/hall-plan' },
        ],
      },
      {
        title: 'Бухгалтерия',
        children: [
          { title: 'Баланс', href: '/documents/balance' },
          {
            title: 'Финансово-Хозяйственная деятельность',
            href: '/documents/finance',
          },
          { title: 'Муниципальное задание', href: '/documents/municipal-task' },
          { title: 'Оказание платных услуг', href: '/documents/paid-services' },
        ],
      },
      { title: 'Устав', href: '/documents/statute' },
      {
        title: 'Положение о клубных формированиях',
        href: '/documents/regulations',
      },
      { title: 'Расписание клубных формирований', href: '/documents/schedule' },
    ],
  },
  security: {
    title: 'Безопасность',
    href: '/security',
    children: [
      { title: 'Антитерро', href: '/security/antiterror' },
      {
        title: 'Профилактика антисоциальных явлений',
        href: '/security/prevention',
      },
    ],
  },
  contact: {
    title: 'Контакты',
    href: '/about',
    children: [
      { title: 'Сотрудники', href: '/employees' },
      { title: 'О нас', href: '/about' },
    ],
  },
};

// Главная константа меню
const NAV_ITEMS: NavItem[] = [
  {
    title: 'Главная',
    href: '/',
  },
  STATIC_TEAMS_MENU as NavItem,
  STATIC_MENUS.documents as NavItem,
  STATIC_MENUS.security as NavItem,
  STATIC_MENUS.contact as NavItem,
];

// Компонент для пунктов меню
const MenuLink: React.FC<{
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  isActive?: boolean;
}> = ({ children, href, onClick, isActive = false }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <Text
      as="span"
      px={5}
      fontSize="xl"
      cursor="pointer"
      transition="all 0.2s ease-in-out"
      color={isActive ? 'blue.600' : 'gray.700'}
      _hover={{
        textDecoration: 'none',
        color: 'blue.600',
      }}
      onClick={handleClick}
    >
      {children}
    </Text>
  );
};

// Компонент для пунктов выпадающего меню
const DropdownItem: React.FC<{
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  hasChildren?: boolean;
}> = ({ children, href, onClick, hasChildren = false }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <Box
      px={4}
      py={2}
      cursor={href ? 'pointer' : 'default'}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      _hover={{ bg: href ? 'blue.50' : 'transparent' }}
      onClick={handleClick}
    >
      <Text fontSize="md" fontWeight={hasChildren ? 'medium' : 'normal'}>
        {children}
      </Text>
      {hasChildren && <LuChevronRight />}
    </Box>
  );
};

// Компонент для меню коллективов
const CollectivesMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  let closeTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsMenuOpen(false);
      setActiveSubmenu(null);
    }, 150);
  };

  const handleSubmenuEnter = (title: string) => {
    clearTimeout(closeTimeout);
    setActiveSubmenu(title);
  };

  const handleSubmenuLeave = () => {
    closeTimeout = setTimeout(() => {
      setActiveSubmenu(null);
    }, 100);
  };

  return (
    <Box
      position="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MenuLink href={STATIC_TEAMS_MENU.href} isActive={isMenuOpen}>
        {STATIC_TEAMS_MENU.title}
      </MenuLink>

      {isMenuOpen && STATIC_TEAMS_MENU.children && (
        <Box
          position="absolute"
          left={0}
          top="100%"
          mt={2}
          width="320px"
          bg="white"
          borderRadius="md"
          boxShadow="xl"
          borderWidth="1px"
          borderColor="gray.200"
          zIndex={50}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {STATIC_TEAMS_MENU.children.map((category, index) => {
            // Пропускаем категории без коллективов
            if (!category.children || category.children.length === 0) {
              return null;
            }

            return (
              <Box
                key={index}
                position="relative"
                onMouseEnter={() => handleSubmenuEnter(category.title)}
                onMouseLeave={handleSubmenuLeave}
              >
                <DropdownItem hasChildren={true}>{category.title}</DropdownItem>

                {activeSubmenu === category.title && category.children && (
                  <Box
                    position="absolute"
                    left="100%"
                    top={0}
                    ml={1}
                    width="350px"
                    maxH="400px"
                    overflowY="auto"
                    bg="white"
                    borderRadius="md"
                    boxShadow="xl"
                    borderWidth="1px"
                    borderColor="gray.200"
                    zIndex={50}
                  >
                    {category.children.map((team, teamIndex) => (
                      <DropdownItem key={teamIndex} href={team.href}>
                        {team.title}
                      </DropdownItem>
                    ))}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

// Компонент для меню документов/безопасности/контактов
const DropdownMenu: React.FC<{
  title: string;
  href?: string;
  children?: MenuItem[];
}> = ({ title, href, children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  let closeTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsMenuOpen(false);
      setActiveSubmenu(null);
    }, 150);
  };

  const handleSubmenuEnter = (title: string) => {
    clearTimeout(closeTimeout);
    setActiveSubmenu(title);
  };

  const handleSubmenuLeave = () => {
    closeTimeout = setTimeout(() => {
      setActiveSubmenu(null);
    }, 100);
  };

  return (
    <Box
      position="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MenuLink href={href} isActive={isMenuOpen}>
        {title}
      </MenuLink>

      {isMenuOpen && children && (
        <Box
          position="absolute"
          left={0}
          top="100%"
          mt={2}
          width="300px"
          bg="white"
          borderRadius="md"
          boxShadow="xl"
          borderWidth="1px"
          borderColor="gray.200"
          zIndex={50}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children.map((item, index) => {
            if (item.children) {
              return (
                <Box
                  key={index}
                  position="relative"
                  onMouseEnter={() => handleSubmenuEnter(item.title)}
                  onMouseLeave={handleSubmenuLeave}
                >
                  <DropdownItem hasChildren={true}>{item.title}</DropdownItem>

                  {activeSubmenu === item.title && item.children && (
                    <Box
                      position="absolute"
                      left="100%"
                      top={0}
                      ml={1}
                      width="300px"
                      bg="white"
                      borderRadius="md"
                      boxShadow="xl"
                      borderWidth="1px"
                      borderColor="gray.200"
                      zIndex={50}
                    >
                      {item.children.map((child, childIndex) => (
                        <DropdownItem key={childIndex} href={child.href}>
                          {child.title}
                        </DropdownItem>
                      ))}
                    </Box>
                  )}
                </Box>
              );
            }

            return (
              <DropdownItem key={index} href={item.href}>
                {item.title}
              </DropdownItem>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

const HeaderMenu: React.FC = () => {
  return (
    <Box
      p={5}
      borderRadius="10px"
      boxShadow="xl"
      borderColor="gray.100"
      _hover={{
        boxShadow: '2xl',
        transition: 'box-shadow 0.3s ease-in-out',
      }}
    >
      <HStack justify="space-around">
        {NAV_ITEMS.map((item, index) => {
          if (item.title === 'Коллективы и Объединения') {
            return <CollectivesMenu key={index} />;
          }

          if (item.children) {
            return (
              <DropdownMenu
                key={index}
                title={item.title}
                href={item.href}
                children={item.children}
              />
            );
          }

          return (
            <MenuLink key={index} href={item.href}>
              {item.title}
            </MenuLink>
          );
        })}
      </HStack>
    </Box>
  );
};

export default HeaderMenu;
