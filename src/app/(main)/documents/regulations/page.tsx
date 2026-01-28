import PDFViewer from '@/components/pdfviewer/pdfviewer';
import { Center, Separator, Stack, Text } from '@chakra-ui/react';

export default function History() {
  return (
    <Stack gap={10}>
      <Text fontSize="2xl" fontWeight="bold">
        Положение о клубных формированиях
      </Text>
      <Separator />
      <Center>
        <Stack>
          <PDFViewer
            fileUrl="/pdf/Polozhenie_po_klubnym_formirovaniam-1.pdf"
            title="Положение клубных формирований"
          />
        </Stack>
      </Center>
    </Stack>
  );
}
