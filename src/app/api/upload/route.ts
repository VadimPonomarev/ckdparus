import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToS3 } from '@/lib/s3-upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 });
    }

    // Конвертируем File в Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Генерируем уникальное имя файла
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `uploads/${timestamp}-${Math.random()
      .toString(36)
      .substring(7)}.${extension}`;

    // Загружаем в S3
    const fileUrl = await uploadFileToS3(buffer, fileName, file.type);

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Ошибка загрузки файла' },
      { status: 500 }
    );
  }
}

// Опционально: ограничение размера
export const config = {
  api: {
    bodyParser: false, // Для FormData
  },
};
