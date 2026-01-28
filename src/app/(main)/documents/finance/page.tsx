import PDFViewer from '@/components/pdfviewer/pdfviewer';
import { Center, Separator, Stack, Text } from '@chakra-ui/react';

export default function History() {
  return (
    <Stack gap={10}>
      <Text fontSize="2xl" fontWeight="bold">
        Финансово-Хозяйственная деятельность
      </Text>
      <Separator />
      <Center>
        <Stack>
          <PDFViewer
            fileUrl="/pdf/2024г.-План-финансово-хозяйственной-деятельности.pdf"
            title="2024 г. План финансово-хозяйственной деятельности"
          />
          <PDFViewer
            fileUrl="/pdf/2025-г.-Отчёт-о-результатах-деятельности-муниципального-учреждения-и-об-использовании-за-ним-имущества.pdf"
            title="2025 г. Отчёт о результатах деятельности муниципального учреждения и об использовании за ним имущества"
          />
          <PDFViewer
            fileUrl="/pdf/2025-Отчёт-об-исполнении-учреждением-плана-фин-хоз-деятельности.pdf"
            title="2025 г.Отчёт об исполнении учреждением плана финансово-хозяйственной деятельности"
          />
        </Stack>
      </Center>
    </Stack>
  );
}
