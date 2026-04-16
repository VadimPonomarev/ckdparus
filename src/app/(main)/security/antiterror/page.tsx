import {
  Separator,
  Stack,
  Text,
  Box,
  Heading,
  Link,
  List,
} from '@chakra-ui/react';
import PDFViewer from '@/components/pdfviewer/pdfviewer';

export default function History() {
  return (
    <Stack gap={10}>
      <Text fontSize="2xl" fontWeight="bold">
        Антитеррор
      </Text>
      <Separator />
      <PDFViewer
        fileUrl="/pdf/презентация_Психологическая_безопасность_1.pdf"
        title="Психологическая безопасность"
      />
      <Separator />
      <Box textAlign="center">
        <Text
          fontSize="lg"
          fontStyle="italic"
          fontWeight="bold"
          color="gray.600"
        >
          Методические рекомендации
        </Text>
      </Box>
      <Separator />
      <List.Root gap={4}>
        <List.Item>
          <Link
            href="http://nac.gov.ru/rekomendacii-po-pravilam-lichnoy-bezopasnosti/obshchie-rekomendacii-grazhdanam.html"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Общие рекомендации гражданам по действиям при угрозе совершения
            террористического акта
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="http://nac.gov.ru/rekomendacii-po-pravilam-lichnoy-bezopasnosti/kak-vesti-sebya-pri-panike-v-tolpe.html"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Как вести себя при панике в толпе во время террористического акта
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="http://nac.gov.ru/rekomendacii-po-pravilam-lichnoy-bezopasnosti/poryadok-deystviy-dolzhnostnyh-lic.html"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Порядок действий должностных лиц и персонала организаций при
            получении сообщений, содержащих угрозы террористического характера
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="http://nac.gov.ru/rekomendacii-po-pravilam-lichnoy-bezopasnosti/poryadok-deystviy-pri-obnaruzhenii.html"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Порядок действий при обнаружении подозрительного предмета, который
            может оказаться взрывным устройством
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://culture-tourism.gov39.ru/antiterror/%D0%9C%D0%B5%D1%82%D0%BE%D0%B4%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5_%D1%80%D0%B5%D0%BA%D0%BE%D0%BC%D0%B5%D0%BD%D0%B4%D0%B0%D1%86%D0%B8%D0%B8_%D0%BF%D0%BE_%D0%BE%D0%B1%D0%BE%D1%80%D1%83%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8E_%D0%98%D0%A2%D0%A1%D0%9E_%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%D0%BE%D0%B2_%D0%BA%D1%83%D0%BB%D1%8C%D1%82%D1%83%D1%80%D1%8B_2020.pdf"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Методические рекомендации по оборудованию ИТСО объектов культуры
            2020
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="http://nac.gov.ru/rekomendacii-po-pravilam-lichnoy-bezopasnosti/esli-ty-okazalsya-v-zalozhnikah.html"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Если ты оказался в заложниках
          </Link>
        </List.Item>
      </List.Root>

      <Box textAlign="center">
        <Text
          fontSize="lg"
          fontStyle="italic"
          fontWeight="bold"
          color="gray.600"
        >
          Методические пособия
        </Text>
      </Box>

      <List.Root gap={3}>
        <List.Item>
          <Link
            href="http://nac.gov.ru/publikacii/oficialnye-izdaniya-nak.html"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Официальные издания НАК
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="http://nac.gov.ru/publikacii/stati-knigi-broshyury.html"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Статьи, книги, брошюры на сайте НАК
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://gov39.ru/working/atk/metodicheskie-posobiya/metodicheskie-rekomendatsii-apparata-atk.php"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Методические рекомендации аппарата АТК
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://gov39.ru/working/atk/metodicheskie-posobiya/metodicheskie-rekomendatsii.php"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Методические рекомендации
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://gov39.ru/working/atk/metodicheskie-posobiya/filmy.php"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Фильмы
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://gov39.ru/working/atk/metodicheskie-posobiya/videoroliki.php"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Видеоролики
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="http://lib39.ru/inform/spiski/antiterror_2018.pdf"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Список литературы из фондов Калининградской областной научной
            библиотеки
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://culture-tourism.gov39.ru/upload/%D0%91%D1%80%D0%BE%D1%88%D1%8E%D1%80%D0%B0%20%D0%91%D0%95%D0%97%D0%9E%D0%9F%D0%90%D0%A1%D0%9D%D0%90%D0%AF%20%D0%A0%D0%9E%D0%A1%D0%A1%D0%98%D0%AF.pdf"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Что такое экстремизм и как ему противостоять?
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://culture-tourism.gov39.ru/upload/%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%BC%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%B0%D0%BB%D1%8B.docx"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Положения КоАП РФ и УК РФ, касающиеся деятельности террористической
            и экстремистской направленности
          </Link>
        </List.Item>
      </List.Root>

      <Box textAlign="center">
        <Text
          fontSize="lg"
          fontStyle="italic"
          fontWeight="bold"
          color="gray.600"
        >
          Нормативно-правовые акты
        </Text>
      </Box>

      <List.Root gap={3}>
        <List.Item>
          <Link
            href="https://culture-tourism.gov39.ru/upload/%D1%81%D1%82%D0%B0%D1%82%D1%8F_20.35_%D0%9A%D0%BE%D0%90%D0%9F_%D0%A0%D0%A4.docx"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Статья 20.35 КоАП РФ
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://culture-tourism.gov39.ru/antiterror/%D0%A4%D0%B5%D0%B4%D0%B5%D1%80%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%B7%D0%B0%D0%BA%D0%BE%D0%BD__%D0%9E_%D0%BF%D1%80%D0%BE%D1%82%D0%B8%D0%B2%D0%BE%D0%B4%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D0%B8_%D1%82%D0%B5%D1%80%D1%80%D0%BE%D1%80%D0%B8%D0%B7%D0%BC%D1%83_35-%D0%A4%D0%97_%D0%BE%D1%82_06.03.2006.docx"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Федеральный закон «О противодействии терроризму» № 35-ФЗ от
            06.03.2006 (в ред. от 08.12.2020)
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://culture-tourism.gov39.ru/antiterror/%D0%A4%D0%B5%D0%B4%D0%B5%D1%80%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%B7%D0%B0%D0%BA%D0%BE%D0%BD_%D0%BE%D1%82_30_%D0%B4%D0%B5%D0%BA%D0%B0%D0%B1%D1%80%D1%8F_2009_%D0%B3_N_384_%D0%A4%D0%97_%D0%A2%D0%95%D0%A5%D0%9D%D0%98%D0%A7%D0%95%D0%A1%D0%9A%D0%98%D0%99_%D0%A0%D0%95%D0%93%D0%9B%D0%90%D0%9C%D0%95%D0%9D%D0%A2_%D0%91%D0%95%D0%97%D0%9E%D0%9F%D0%90%D0%A1%D0%9D%D0%9E%D0%A1%D0%A2%D0%98_%D0%97%D0%94%D0%90%D0%9D%D0%98%D0%99%20%281%29.rtf"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Федеральный закон РФ. N 384-ФЗ от 30.12.2009 г.
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://culture-tourism.gov39.ru/antiterror/%D0%A1%D0%B2%D0%BE%D0%B4_%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB_%D0%A1%D0%9F_132_13330_2011_%D0%9E%D0%B1%D0%B5%D1%81%D0%BF%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B0%D0%BD%D1%82%D0%B8%D1%82%D0%B5%D1%80%D1%80%D0%BE%D1%80%D0%B8%D1%81%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B9_%D0%B7%D0%B0%D1%89%D0%B8%D1%89%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D0%B7%D0%B4%D0%B0%D0%BD%20%281%29.rtf"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Свод правил СП 132 13330 2011 Обеспечение антитеррористической
            защищенности зданий
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://culture-tourism.gov39.ru/antiterror/%D0%9F%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5_%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%B0_%D0%A0%D0%A4_%D0%BE%D1%82_25_%D0%BC%D0%B0%D1%80%D1%82%D0%B0_2015_%D0%B3_N_272_%D0%9E%D0%B1_%D1%83%D1%82%D0%B2%D0%B5%D1%80%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B8_%D1%82%D1%80%D0%B5%D0%B1%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B9_%D0%BA_%D0%B0%D0%BD%D1%82%D0%B8%D1%82%D0%B5%D1%80%D1%80%D0%BE%D1%80%D0%B8%D1%81%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B9_%D0%B7%D0%B0%D1%89%D0%B8%D1%89%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D0%BC%D0%B5%D1%81.rtf"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Постановление правительства РФ № 272 от 25.03.2015 (с изменениями)
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://culture-tourism.gov39.ru/antiterror/%D0%9F%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5_%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%B0_%D0%A0%D0%A4_%D0%BE%D1%82_11_%D1%84%D0%B5%D0%B2%D1%80%D0%B0%D0%BB%D1%8F_2017_%D0%B3_N_176_%D0%9E%D0%B1_%D1%83%D1%82%D0%B2%D0%B5%D1%80%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B8_%D1%82%D1%80%D0%B5%D0%B1%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B9_%D0%BA_%D0%90%D0%A2%D0%97_%D0%BE%D0%B1%D1%8B%D0%B5%D0%BA%D1%82%D0%BE%D0%B2_%D0%BA%D1%83%D0%BB%D1%8C%D1%82%D1%83%D1%80%D1%8B.rtf"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Постановление правительства РФ № 176 от 11.02.2017 (с изменениями)
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://culture-tourism.gov39.ru/upload/%D0%9F%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D1%82%2014.04.2017%20%E2%84%96%20447.docx"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Постановление Правительства РФ № 447 от 14.04.2017
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://culture-tourism.gov39.ru/antiterror/%D0%9F%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5_%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%B0_%D0%A0%D0%A4_%D0%BE%D1%82_2_%D0%B0%D0%B2%D0%B3%D1%83%D1%81%D1%82%D0%B0_2019_%D0%B3_N_1006_%D0%9E%D0%B1_%D1%83%D1%82%D0%B2%D0%B5%D1%80%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B8_%D1%82%D1%80%D0%B5%D0%B1%D0%BE%D0%B2%D0%B0_%D0%9F%D0%A0%D0%9E%D0%A1%D0%92%D0%95%D0%A9%20%281%29.rtf"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Постановление Правительства РФ г. N 1006 от 02.08.2019
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://culture-tourism.gov39.ru/upload/%D0%9F%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5_%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%B0_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%BE%D0%B9_%D0%A4%D0%B5%D0%B4%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8_%D0%BE%D1%82_05.09.2019___1165.docx"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Постановление Правительства РФ № 1165 от 05.09.2019
          </Link>
        </List.Item>

        <List.Item>
          <Link
            href="https://culture-tourism.gov39.ru/antiterror/%D0%A1%D0%A2%D0%A0%D0%90%D0%A2%D0%95%D0%93%D0%98%D0%AF_%D0%AD%D0%9A%D0%A1%D0%A2%D0%A0%D0%95%D0%9C%D0%98%D0%97%D0%9C_2025.pdf"
            color="blue.600"
            _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          >
            Стратегия противодействия экстремизму до 2025 года
          </Link>
        </List.Item>
      </List.Root>

      <Box
        textAlign="center"
        py={6}
        borderTop="1px solid"
        borderColor="gray.200"
      >
        <Text
          fontSize="lg"
          fontStyle="italic"
          fontWeight="bold"
          color="gray.700"
          mb={4}
        >
          Дежурная служба "Антитеррор" – 8 (4012) 214-885
        </Text>
        <Link
          href="http://nac.gov.ru/"
          fontSize="lg"
          color="blue.600"
          _hover={{ color: 'blue.500', textDecoration: 'underline' }}
          display="inline-flex"
          alignItems="center"
          gap={2}
        >
          Сайт Национального антитеррористического комитета
        </Link>
      </Box>
    </Stack>
  );
}
