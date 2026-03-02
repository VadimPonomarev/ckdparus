import {
  Grid,
  GridItem,
  HStack,
  Image,
  Link,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react';

const Links = () => {
  return (
    <Stack width="100%" position="relative">
      <Text fontSize="2xl" fontWeight="bold">
        Полезные ссылки
      </Text>
      <Separator />
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(7, 1fr)' }}
        justifyItems="center"
        gap={5}
      >
        <Link href="https://culture.gov.ru">
          <Image
            src="/images/min_kulturi.jpg"
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
            src="/images/min_cultur_kal_obl.png"
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
            src="/images/kultura_rf.png"
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
            src="/images/home_polenova.png"
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
        <Link href="https://odnt.ru" justifyContent="center">
          <Image
            src="/images/oblastnoi_dom.jpg"
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
        <Link href="https://www.culture.ru/pushkinskaya-karta">
          <Image
            src="/images/pushlin_card.jpg"
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
            src="/images/cultura_grand.jpg"
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
            src="/images/pobeda_80.jpg"
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
        <Link href="https://gov39.ru/" justifyContent="center">
          <Image
            src="/images/ravitelstvo.jpg"
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
            src="/images/bus_gov.jpg"
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

        <Link href="https://39советск.рф" justifyContent="center">
          <Image
            src="/images/sovetsk.jpg"
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
            src="/images/ostup_sreda.jpg"
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
            src="/images/tel_doveria.png"
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
            src="/images/pro_cultura_rf.png"
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
      </Grid>
    </Stack>
  );
};

export default Links;
