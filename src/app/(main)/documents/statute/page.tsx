import PDFViewer from '@/components/pdfviewer/pdfviewer';
import { Center, Separator, Stack, Text } from '@chakra-ui/react';

export default function History() {
  return (
    <Stack gap={10}>
      <Text fontSize="2xl" fontWeight="bold">
        Устав
      </Text>
      <Separator />
      <Center>
        <Stack>
          <PDFViewer
            fileUrl="/pdf/Устав-МАУК-ЦКД-Парус.-Новая-редакция-2016-г.pdf"
            title="Устав МАУК ЦКД Парус. Новая редакция 2016 г."
          />
        </Stack>
      </Center>
    </Stack>
  );
}
