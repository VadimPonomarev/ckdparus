import PDFViewer from '@/components/pdfviewer/pdfviewer';
import { Center, Image, Separator, Stack, Text } from '@chakra-ui/react';

export default function History() {
  return (
    <Stack gap={10}>
      <Text fontSize="2xl" fontWeight="bold">
        Положение о порядке реализации билетов
      </Text>
      <Separator />
      <Center>
        <Stack>
          <PDFViewer
            fileUrl="/pdf/ticketrelease.pdf"
            title="Положение о порядке реализации билетов и реализации билетов льготным категориям граждан"
          />
        </Stack>
      </Center>
    </Stack>
  );
}
