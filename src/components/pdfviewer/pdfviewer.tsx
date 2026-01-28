import { HStack, Stack, Text } from '@chakra-ui/react';
import { FaFilePdf } from 'react-icons/fa6';

interface PDFViewerProps {
  fileUrl: string;
  title: string;
}

export default function PDFViewer({ fileUrl, title }: PDFViewerProps) {
  // Формируем имя файла для скачивания
  const downloadFileName = title.endsWith('.pdf') ? title : `${title}.pdf`;

  return (
    <Stack>
      <a
        href={fileUrl}
        download={downloadFileName}
        style={{ textDecoration: 'none' }}
      >
        <HStack
          cursor="pointer"
          p={3}
          borderRadius="md"
          _hover={{
            transition: 'all 0.3s ease-in-out',
            '& > p': {
              textShadow: '0 0 8px rgba(0,0,0,0.2)',
              transform: 'translateY(-1px)',
            },
            '& > svg': {
              transform: 'scale(1.1)',
              transition: 'transform 0.3s ease-in-out',
            },
          }}
        >
          <FaFilePdf color="red" size={25} />
          <Text fontSize="2xl" transition="all 0.3s ease-in-out">
            {title}
          </Text>
        </HStack>
      </a>
    </Stack>
  );
}
