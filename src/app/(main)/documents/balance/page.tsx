import PDFViewer from '@/components/pdfviewer/pdfviewer';
import { Center, Separator, Stack, Text } from '@chakra-ui/react';

export default function History() {
  return (
    <Stack gap={10}>
      <Text fontSize="2xl" fontWeight="bold">
        Баланс
      </Text>
      <Separator />
      <Center>
        <Stack>
          <PDFViewer fileUrl="/pdf/Баланс-2021год-2.pdf" title="Баланс 2021" />
          <PDFViewer fileUrl="/pdf/Баланс-2022г.pdf" title="Баланс 2022 " />
          <PDFViewer fileUrl="/pdf/Баланс-2023г1059.pdf" title="Баланс 2023" />
          <PDFViewer fileUrl="/pdf/Баланс-2025г.pdf" title="Баланс 2025" />
        </Stack>
      </Center>
    </Stack>
  );
}
