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
          <PDFViewer
            fileUrl="/pdf/Отчет о результатах деятельности за 2025г.pdf"
            title="Отчет о результатах деятельности за 2025г"
          />
          <PDFViewer
            fileUrl="/pdf/Отчет о финансовых результатах  721_ 2025г.pdf"
            title="Отчет о финансовых результатах  721_ 2025г"
          />
          <PDFViewer fileUrl="/pdf/План ФХД 2025г.pdf" title="План ФХД 2025г" />
          <PDFViewer
            fileUrl="/pdf/Отчет об исполнении ПФХД 737(2) 2025г.pdf"
            title="Отчет об исполнении ПФХД 737(2) 2025г"
          />
          <PDFViewer
            fileUrl="/pdf/Отчет об исполнении ПФХД 737(4)_ 2025г.pdf"
            title="Отчет об исполнении ПФХД 737(4)_ 2025г"
          />
          <PDFViewer
            fileUrl="/pdf/Отчет об исполнении ПФХД  737(5)_ 2025г.pdf"
            title="Отчет об исполнении ПФХД 737(5)_ 2025г"
          />
          <PDFViewer
            fileUrl="/pdf/Сведения об операциях с целевыми субсидиями 2025г.pdf"
            title="Сведения об операциях с целевыми субсидиями 2025г"
          />
          <PDFViewer
            fileUrl="/pdf/Средняя ЗП 2025г.pdf"
            title="Средняя ЗП 2025г"
          />
        </Stack>
      </Center>
    </Stack>
  );
}
