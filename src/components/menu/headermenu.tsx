'use client';

import {
  Box,
  HStack,
  Menu,
  Portal,
  Text,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { LuChevronRight } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Типы
interface Team {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  subcategory: string | null;
}

interface SubMenuItem {
  title: string;
  items?: Team[];
  href?: string;
}

interface MenuData {
  title: string;
  items: SubMenuItem[];
  href?: string;
}

interface NavItem {
  title: string;
  href?: string;
  menu?: SubMenuItem[];
}

// Категории меню
const COLLECTIVE_CATEGORIES = [
  { title: 'Хореографические', filter: ['Хореография'] },
  { title: 'Вокальные', filter: ['Вокал'] },
  { title: 'Инструментальные', filter: ['Инструментальные'] },
  { title: 'Театральные', filter: ['Театр'] },
  { title: 'Клубы по интересам', filter: ['Клубы'] },
];

// Константы для остального меню (документы, безопасность, контакты)
const MENU_ITEMS: Record<string, MenuData> = {
  documents: {
    title: 'Документы',
    href: '/documents',
    items: [
      {
        title: 'Общая информация об учреждении',
        items: [
          {
            id: 'doc_history',
            name: 'История',
            slug: 'history',
            category: 'Документ',
            subcategory: null,
          },
          {
            id: 'doc_hall_plan',
            name: 'План зрительного зала',
            slug: 'hall-plan',
            category: 'Документ',
            subcategory: null,
          },
        ],
      },
      {
        title: 'Бухгалтерия',
        items: [
          {
            id: 'doc_balance',
            name: 'Баланс',
            slug: 'balance',
            category: 'Документ',
            subcategory: null,
          },
          {
            id: 'doc_finance',
            name: 'Финансово-Хозяйственная деятельность',
            slug: 'finance',
            category: 'Документ',
            subcategory: null,
          },
          {
            id: 'doc_municipal_task',
            name: 'Муниципальное задание',
            slug: 'municipal-task',
            category: 'Документ',
            subcategory: null,
          },
          {
            id: 'doc_paid_services',
            name: 'Оказание платных услуг',
            slug: 'paid-services',
            category: 'Документ',
            subcategory: null,
          },
        ],
      },
      {
        title: 'Устав',
        href: '/documents/statute',
      },
      {
        title: 'Положение о клубных формированиях',
        href: '/documents/regulations',
      },
      {
        title: 'Расписание клубных формирований',
        href: '/documents/schedule',
      },
    ],
  },
  security: {
    title: 'Безопасность',
    href: '/security',
    items: [
      {
        title: 'Антитерро',
        href: '/security/antiterror',
      },
      {
        title: 'Профилактика антисоциальных явлений',
        href: '/security/prevention',
      },
    ],
  },
  contact: {
    title: 'Контакты',
    href: '/about',
    items: [
      {
        title: 'Сотрудники',
        href: '/employees',
      },
      {
        title: 'О нас',
        href: '/about',
      },
    ],
  },
};

// Компонент для загрузки коллективов из API
const useTeamsFromAPI = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true);
        const response = await fetch('/api/teams');
        if (!response.ok) {
          throw new Error('Ошибка загрузки коллективов');
        }
        const data = await response.json();
        setTeams(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        console.error('Ошибка загрузки коллективов:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  return { teams, loading, error };
};

// Группируем коллективы по категориям
const groupTeamsByCategories = (teams: Team[]) => {
  const grouped: SubMenuItem[] = COLLECTIVE_CATEGORIES.map(category => ({
    title: category.title,
    items: teams.filter(
      team => team.category && category.filter.includes(team.category)
    ),
  }));

  // Добавляем "Другие" для коллективов, которые не попали в категории
  const otherTeams = teams.filter(
    team =>
      !team.category ||
      !COLLECTIVE_CATEGORIES.some(cat =>
        cat.filter.includes(team.category || '')
      )
  );

  if (otherTeams.length > 0) {
    grouped.push({
      title: 'Другие',
      items: otherTeams,
    });
  }

  return grouped;
};

// Компонент для пунктов меню с анимацией
interface AnimatedTextProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  [key: string]: any;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  href,
  onClick,
  ...props
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
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
      _hover={{
        textDecoration: 'none',
        color: 'blue.600',
      }}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Text>
  );
};

// Используем кастомный компонент для пунктов меню вместо Menu.Item
const CustomMenuItem = ({
  children,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any;
}) => {
  return (
    <Box
      px={5}
      py={2}
      cursor="pointer"
      whiteSpace="normal"
      maxW="400px"
      _hover={{ bg: 'blue.50' }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Box>
  );
};

// Компонент для вложенного меню
interface SubMenuProps {
  title: string;
  items?: Team[];
  href?: string;
}

const SubMenu: React.FC<SubMenuProps> = ({ title, items, href }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const router = useRouter();
  let closeTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout);
    setIsSubmenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsSubmenuOpen(false);
    }, 150);
  };

  const handleItemClick = (e: React.MouseEvent, team?: Team) => {
    e.preventDefault();
    if (href) {
      router.push(href);
    } else if (team) {
      router.push(`/teams/${team.id}`);
    }
  };

  // Если есть ссылка, делаем кликабельным
  if (href) {
    return (
      <CustomMenuItem onClick={e => handleItemClick(e)}>{title}</CustomMenuItem>
    );
  }

  // Если нет подпунктов, отображаем как обычный пункт меню
  if (!items || items.length === 0) {
    return <CustomMenuItem>{title}</CustomMenuItem>;
  }

  // Если есть подпункты, отображаем как подменю
  return (
    <Menu.Root
      open={isSubmenuOpen}
      onOpenChange={e => setIsSubmenuOpen(e.open)}
      positioning={{ placement: 'right-start', gutter: 2 }}
    >
      <Menu.TriggerItem
        px={5}
        py={2}
        cursor="pointer"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        _hover={{ bg: 'blue.50' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {title} <LuChevronRight />
      </Menu.TriggerItem>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {items.map((team, index) => (
              <CustomMenuItem
                key={team.id}
                onClick={e => handleItemClick(e, team)}
              >
                {team.name}
              </CustomMenuItem>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

// Компонент для главного меню
interface MainMenuProps {
  title: string;
  items: SubMenuItem[];
  href?: string;
}

const MainMenu: React.FC<MainMenuProps> = ({ title, items, href }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  let closeTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsMenuOpen(false);
    }, 150);
  };

  const handleContentMouseEnter = () => {
    clearTimeout(closeTimeout);
    setIsMenuOpen(true);
  };

  const handleContentMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsMenuOpen(false);
    }, 150);
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (href) {
      router.push(href);
      setIsMenuOpen(false);
    }
  };

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Menu.Root open={isMenuOpen} onOpenChange={e => setIsMenuOpen(e.open)}>
        <Menu.Trigger asChild>
          <Text
            px={5}
            fontSize="xl"
            cursor="pointer"
            transition="all 0.2s ease-in-out"
            _hover={{
              textDecoration: 'none',
              color: 'blue.600',
            }}
            onClick={handleTitleClick}
          >
            {title}
          </Text>
        </Menu.Trigger>
        {isMenuOpen && (
          <Portal>
            <Menu.Positioner>
              <Menu.Content
                onMouseEnter={handleContentMouseEnter}
                onMouseLeave={handleContentMouseLeave}
              >
                {items.map((submenu, index) => (
                  <SubMenu
                    key={index}
                    title={submenu.title}
                    items={submenu.items}
                    href={submenu.href}
                  />
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        )}
      </Menu.Root>
    </div>
  );
};

// Упрощенный компонент меню коллективов
const CollectivesMenu: React.FC = () => {
  const { teams, loading, error } = useTeamsFromAPI();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let closeTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsMenuOpen(false);
    }, 150);
  };

  const handleContentMouseEnter = () => {
    clearTimeout(closeTimeout);
    setIsMenuOpen(true);
  };

  const handleContentMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsMenuOpen(false);
    }, 150);
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/teams');
    setIsMenuOpen(false);
  };

  const handleTeamClick = (e: React.MouseEvent, teamId: string) => {
    e.preventDefault();
    router.push(`/teams/${teamId}`);
    setIsMenuOpen(false);
  };

  const groupedItems = teams.length > 0 ? groupTeamsByCategories(teams) : [];

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Menu.Root open={isMenuOpen} onOpenChange={e => setIsMenuOpen(e.open)}>
        <Menu.Trigger asChild>
          <Text
            px={5}
            fontSize="xl"
            cursor="pointer"
            transition="all 0.2s ease-in-out"
            _hover={{
              textDecoration: 'none',
              color: 'blue.600',
            }}
            onClick={handleTitleClick}
          >
            {loading ? 'Коллективы...' : 'Коллективы и Объединения'}
          </Text>
        </Menu.Trigger>
        {isMenuOpen && teams.length > 0 && !loading && !error && (
          <Portal>
            <Menu.Positioner>
              <Menu.Content
                onMouseEnter={handleContentMouseEnter}
                onMouseLeave={handleContentMouseLeave}
              >
                {groupedItems.map((submenu, index) => {
                  if (!submenu.items || submenu.items.length === 0) {
                    return null;
                  }

                  return (
                    <Menu.Root
                      key={index}
                      positioning={{ placement: 'right-start', gutter: 2 }}
                    >
                      <Menu.TriggerItem
                        px={5}
                        py={2}
                        cursor="pointer"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        _hover={{ bg: 'blue.50' }}
                      >
                        {submenu.title} <LuChevronRight />
                      </Menu.TriggerItem>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content>
                            {submenu.items.map(team => (
                              <CustomMenuItem
                                key={team.id}
                                onClick={e => handleTeamClick(e, team.id)}
                              >
                                {team.name}
                              </CustomMenuItem>
                            ))}
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                  );
                })}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        )}
      </Menu.Root>
    </div>
  );
};

const HeaderMenu: React.FC = () => {
  const NAV_ITEMS: NavItem[] = [
    {
      title: 'Главная',
      href: '/',
    },
    {
      title: 'Коллективы и Объединения',
      href: '/teams',
    },
    {
      title: MENU_ITEMS.documents.title,
      menu: MENU_ITEMS.documents.items,
      href: MENU_ITEMS.documents.href,
    },
    {
      title: MENU_ITEMS.security.title,
      menu: MENU_ITEMS.security.items,
      href: MENU_ITEMS.security.href,
    },
    {
      title: MENU_ITEMS.contact.title,
      menu: MENU_ITEMS.contact.items,
      href: MENU_ITEMS.contact.href,
    },
  ];

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

          if (item.menu) {
            return (
              <MainMenu
                key={index}
                title={item.title}
                items={item.menu}
                href={item.href}
              />
            );
          }

          return (
            <AnimatedText key={index} href={item.href}>
              {item.title}
            </AnimatedText>
          );
        })}
      </HStack>
    </Box>
  );
};

export default HeaderMenu;
