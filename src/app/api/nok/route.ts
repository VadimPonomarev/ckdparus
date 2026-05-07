import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Валидация возрастных групп
const validAges = ['18-30', '31-45', '46-55', 'Старше 55 лет'];

// Общие варианты ответов для валидации
const ratingOptions = [
  'Отлично, все устраивает',
  'В целом хорошо',
  'Удовлетворительно, незначительные недостатки',
  'Плохо, много недостатков',
  'Неудовлетворительно, совершенно не устраивает',
  'Затрудняюсь ответить',
];

const kindessOptions = [
  'Отлично, все устраивает',
  'В целом хорошо',
  'Удовлетворительно',
  'Плохо',
  'Неудовлетворительно',
  'Затрудняюсь ответить',
];

const scheduleOptions = [
  'Отлично, очень удобно',
  'В целом хорошо',
  'Удовлетворительно, незначительные недостатки',
  'Плохо, много недостатков',
  'Совершенно не удобно',
  'Затрудняюсь ответить',
];

const frequencyOptions = [
  'Никогда не сталкивался',
  'Сталкивался, но не более одного раза',
  'Сталкиваюсь, но очень редко',
  'Сталкиваюсь время от времени',
  'Сталкиваюсь регулярно',
  'Затрудняюсь ответить',
];

const satisfactionOptions = [
  'Полностью удовлетворен',
  'Скорее удовлетворен',
  'В чем-то удовлетворен, в чем-то нет',
  'Скорее не удовлетворен',
  'Совершенно не удовлетворен',
  'Затрудняюсь ответить',
];

const recommendOptions = [
  'Точно порекомендую',
  'Скорее порекомендую',
  'Скорее не порекомендую',
  'Точно не порекомендую',
  'Затрудняюсь ответить',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Валидация возраста
    if (!validAges.includes(body.q15_age)) {
      return NextResponse.json(
        { error: 'Некорректная возрастная группа' },
        { status: 400 }
      );
    }

    // Создаем ответ
    const response = await prisma.nokResponse.create({
      data: {
        q1_comfort: body.q1_comfort,
        q2_kindness: body.q2_kindness,
        q3_schedule: body.q3_schedule,
        q4_infoStands: body.q4_infoStands,
        q5_websiteInfo: body.q5_websiteInfo,
        q6_electronicServices: body.q6_electronicServices,
        q7_additionalServices: body.q7_additionalServices,
        q8_printMaterials: body.q8_printMaterials,
        q9_timeViolation: body.q9_timeViolation,
        q10_workDiscipline: body.q10_workDiscipline,
        q11_competence: body.q11_competence,
        q12_materialTech: body.q12_materialTech,
        q13_satisfaction: body.q13_satisfaction,
        q14_recommend: body.q14_recommend,
        q15_age: body.q15_age,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Спасибо за участие в опросе!',
      data: response,
    });
  } catch (error) {
    console.error('Error saving NOK response:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// GET - получение статистики (для админов)
export async function GET(request: NextRequest) {
  try {
    const responses = await prisma.nokResponse.findMany();

    // Подсчет статистики по каждому вопросу
    const stats: any = {};

    // Функция для подсчета вариантов ответов
    const calculateStats = (responses: any[], field: string) => {
      const counts: Record<string, number> = {};
      responses.forEach(response => {
        const value = response[field];
        if (value) {
          counts[value] = (counts[value] || 0) + 1;
        }
      });
      return counts;
    };

    for (let i = 1; i <= 15; i++) {
      stats[`q${i}`] = calculateStats(responses, `q${i}_${getFieldName(i)}`);
    }

    stats.totalResponses = responses.length;
    stats.ageDistribution = calculateStats(responses, 'q15_age');

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching NOK stats:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

function getFieldName(questionNumber: number): string {
  const fields: Record<number, string> = {
    1: 'comfort',
    2: 'kindness',
    3: 'schedule',
    4: 'infoStands',
    5: 'websiteInfo',
    6: 'electronicServices',
    7: 'additionalServices',
    8: 'printMaterials',
    9: 'timeViolation',
    10: 'workDiscipline',
    11: 'competence',
    12: 'materialTech',
    13: 'satisfaction',
    14: 'recommend',
    15: 'age',
  };
  return fields[questionNumber];
}
