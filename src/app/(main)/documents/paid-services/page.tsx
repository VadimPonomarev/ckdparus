import PDFViewer from '@/components/pdfviewer/pdfviewer';
import { Center, Separator, Stack, Text } from '@chakra-ui/react';

export default function History() {
  return (
    <Stack gap={10}>
      <Text fontSize="2xl" fontWeight="bold">
        Оказание платных услуг
      </Text>
      <Separator />
      <Center>
        <Stack>
          <PDFViewer
            fileUrl="/pdf/Калькуляция.pdf"
            title="Перечень оказываемых платных услуг, цены (тарифы) на услуги"
          />
        </Stack>
      </Center>
    </Stack>
  );
}
