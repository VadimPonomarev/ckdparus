import PDFViewer from '@/components/pdfviewer/pdfviewer';
import { Center, Separator, Stack, Text } from '@chakra-ui/react';

export default function History() {
  return (
    <Stack gap={10}>
      <Text fontSize="2xl" fontWeight="bold">
        Муниципальное задание
      </Text>
      <Separator />
      <Center>
        <Stack>
          <PDFViewer
            fileUrl="/pdf/Муниципальное-задание-2023.pdf"
            title="Муниципальное задание 2023"
          />
          <PDFViewer
            fileUrl="/pdf/Муниципальное-задание-2024.pdf"
            title="Муниципальное задание 2024"
          />
          <PDFViewer
            fileUrl="/pdf/Муниципальное-задание-2025.pdf"
            title="Муниципальное задание 2025"
          />
          <PDFViewer fileUrl="/pdf/Отчет-МЗ-2023.pdf" title="Отчет МЗ 2023 " />
          <PDFViewer fileUrl="/pdf/Отчет-МЗ-2024.pdf" title="Отчет МЗ 2024" />
        </Stack>
      </Center>
    </Stack>
  );
}
