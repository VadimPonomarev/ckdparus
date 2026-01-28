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
            fileUrl="/pdf/ilovepdf_merged.pdf"
            title="Оказание платных услуг"
          />
        </Stack>
      </Center>
    </Stack>
  );
}
