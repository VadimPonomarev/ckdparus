import { HStack, Image, Link, Separator, Stack, Text } from '@chakra-ui/react';

const Links = () => {
  return (
    <Stack width="100%" position="relative">
      <Text fontSize="2xl" fontWeight="bold">
        Полезные ссылки
      </Text>
      <Separator />
      <HStack width="100%" pt={10} justify="space-between">
        <Link href="https://culture.gov.ru">
          <Image
            src="min_kulturi.jpg"
            alt="Министерство культуры РФ"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            h="150px"
          />
        </Link>
        <Link href="https://culture-tourism.gov39.ru">
          <Image
            src="min_cultur_kal_obl.png"
            alt="Министерство культуры калининградской области"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            h="150px"
          />
        </Link>
        <Link href="https://www.culture.ru">
          <Image
            src="kultura_rf.png"
            alt="Культура.РФ"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            h="150px"
          />
        </Link>
        <Link href="https://110.rusfolk.ru">
          <Image
            src="home_polenova.png"
            alt="Государственный Российский Дом народного творчества имени В.Д.Поленова"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            h="150px"
          />
        </Link>
        <Link href="https://odnt.ru">
          <Image
            src="oblastnoi_dom.jpg"
            alt="Областной дом народного творчества Калининградской области"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            h="150px"
          />
        </Link>
      </HStack>
      <HStack width="100%" py={10} justify="space-between">
        <Link href="https://www.culture.ru/pushkinskaya-karta">
          <Image
            src="pushlin_card.jpg"
            alt="Пушкинская карта"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            h="150px"
          />
        </Link>
        <Link href="https://grants.culture.ru/">
          <Image
            src="cultura_grand.jpg"
            alt="Культура. Гранты России"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            h="150px"
          />
        </Link>
        <Link href="https://may9.ru/">
          <Image
            src="pobeda_80.jpg"
            alt="Побуда 80"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            h="150px"
          />
        </Link>
        <Link href="https://gov39.ru/">
          <Image
            src="ravitelstvo.jpg"
            alt="Правительство Калининградской области"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            h="150px"
          />
        </Link>
        <Link href="https://bus.gov.ru/">
          <Image
            src="bus_gov.jpg"
            alt="Bus Gov"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            h="150px"
          />
        </Link>
      </HStack>
      <HStack width="100%" py={10} justify="space-between">
        <Link href="https://39советск.рф">
          <Image
            src="sovetsk.jpg"
            alt="Советский городской округ"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            h="150px"
          />
        </Link>
        <Link href="https://zhit-vmeste.ru">
          <Image
            src="ostup_sreda.jpg"
            alt="Доступная среда"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            h="150px"
          />
        </Link>
        <Link href="https://vdtd.ru/">
          <Image
            src="tel_doveria.png"
            alt="Информационно-методический портал для специалистов Общероссийского детского телефона доверия"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            h="150px"
          />
        </Link>
        <Link href="https://pro.culture.ru/">
          <Image
            src="pro_cultura_rf.png"
            alt="PRO Культура РФ"
            objectFit="contain"
            borderRadius="20px"
            boxShadow="xl"
            borderColor="gray.100"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.3s ease-in-out',
            }}
            h="150px"
          />
        </Link>
      </HStack>
    </Stack>
  );
};

export default Links;
