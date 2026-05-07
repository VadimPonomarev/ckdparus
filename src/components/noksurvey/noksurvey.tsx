// app/nok/page.tsx
'use client';

import {
  Button,
  Container,
  Heading,
  Stack,
  Text,
  VStack,
  HStack,
  Separator,
  Card,
  CardBody,
  CardHeader,
  Alert,
  Fieldset,
  RadioGroup,
  Box,
} from '@chakra-ui/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toaster } from '@/components/ui/toaster';
import { useState } from 'react';

// Схема валидации для всех вопросов
const formSchema = z.object({
  q1_comfort: z.string({ message: 'Ответьте на вопрос 1' }),
  q2_kindness: z.string({ message: 'Ответьте на вопрос 2' }),
  q3_schedule: z.string({ message: 'Ответьте на вопрос 3' }),
  q4_infoStands: z.string({ message: 'Ответьте на вопрос 4' }),
  q5_websiteInfo: z.string({ message: 'Ответьте на вопрос 5' }),
  q6_electronicServices: z.string({ message: 'Ответьте на вопрос 6' }),
  q7_additionalServices: z.string({ message: 'Ответьте на вопрос 7' }),
  q8_printMaterials: z.string({ message: 'Ответьте на вопрос 8' }),
  q9_timeViolation: z.string({ message: 'Ответьте на вопрос 9' }),
  q10_workDiscipline: z.string({ message: 'Ответьте на вопрос 10' }),
  q11_competence: z.string({ message: 'Ответьте на вопрос 11' }),
  q12_materialTech: z.string({ message: 'Ответьте на вопрос 12' }),
  q13_satisfaction: z.string({ message: 'Ответьте на вопрос 13' }),
  q14_recommend: z.string({ message: 'Ответьте на вопрос 14' }),
  q15_age: z.string({ message: 'Укажите ваш возраст' }),
});

type FormValues = z.infer<typeof formSchema>;

// Варианты ответов
const ratingOptions = [
  { value: 'Отлично, все устраивает', label: 'Отлично, все устраивает' },
  { value: 'В целом хорошо', label: 'В целом хорошо' },
  {
    value: 'Удовлетворительно, незначительные недостатки',
    label: 'Удовлетворительно, незначительные недостатки',
  },
  { value: 'Плохо, много недостатков', label: 'Плохо, много недостатков' },
  {
    value: 'Неудовлетворительно, совершенно не устраивает',
    label: 'Неудовлетворительно, совершенно не устраивает',
  },
  { value: 'Затрудняюсь ответить', label: 'Затрудняюсь ответить' },
];

const kindnessOptions = [
  { value: 'Отлично, все устраивает', label: 'Отлично, все устраивает' },
  { value: 'В целом хорошо', label: 'В целом хорошо' },
  { value: 'Удовлетворительно', label: 'Удовлетворительно' },
  { value: 'Плохо', label: 'Плохо' },
  { value: 'Неудовлетворительно', label: 'Неудовлетворительно' },
  { value: 'Затрудняюсь ответить', label: 'Затрудняюсь ответить' },
];

const scheduleOptions = [
  { value: 'Отлично, очень удобно', label: 'Отлично, очень удобно' },
  { value: 'В целом хорошо', label: 'В целом хорошо' },
  {
    value: 'Удовлетворительно, незначительные недостатки',
    label: 'Удовлетворительно, незначительные недостатки',
  },
  { value: 'Плохо, много недостатков', label: 'Плохо, много недостатков' },
  { value: 'Совершенно не удобно', label: 'Совершенно не удобно' },
  { value: 'Затрудняюсь ответить', label: 'Затрудняюсь ответить' },
];

const frequencyOptions = [
  { value: 'Никогда не сталкивался', label: 'Никогда не сталкивался' },
  {
    value: 'Сталкивался, но не более одного раза',
    label: 'Сталкивался, но не более одного раза',
  },
  {
    value: 'Сталкиваюсь, но очень редко',
    label: 'Сталкиваюсь, но очень редко',
  },
  {
    value: 'Сталкиваюсь время от времени',
    label: 'Сталкиваюсь время от времени',
  },
  { value: 'Сталкиваюсь регулярно', label: 'Сталкиваюсь регулярно' },
  { value: 'Затрудняюсь ответить', label: 'Затрудняюсь ответить' },
];

const satisfactionOptions = [
  { value: 'Полностью удовлетворен', label: 'Полностью удовлетворен' },
  { value: 'Скорее удовлетворен', label: 'Скорее удовлетворен' },
  {
    value: 'В чем-то удовлетворен, в чем-то нет',
    label: 'В чем-то удовлетворен, в чем-то нет',
  },
  { value: 'Скорее не удовлетворен', label: 'Скорее не удовлетворен' },
  { value: 'Совершенно не удовлетворен', label: 'Совершенно не удовлетворен' },
  { value: 'Затрудняюсь ответить', label: 'Затрудняюсь ответить' },
];

const recommendOptions = [
  { value: 'Точно порекомендую', label: 'Точно порекомендую' },
  { value: 'Скорее порекомендую', label: 'Скорее порекомендую' },
  { value: 'Скорее не порекомендую', label: 'Скорее не порекомендую' },
  { value: 'Точно не порекомендую', label: 'Точно не порекомендую' },
  { value: 'Затрудняюсь ответить', label: 'Затрудняюсь ответить' },
];

const ageOptions = [
  { value: '18-30', label: '18-30' },
  { value: '31-45', label: '31-45' },
  { value: '46-55', label: '46-55' },
  { value: 'Старше 55 лет', label: 'Старше 55 лет' },
];

export default function NokSurvey() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      q1_comfort: '',
      q2_kindness: '',
      q3_schedule: '',
      q4_infoStands: '',
      q5_websiteInfo: '',
      q6_electronicServices: '',
      q7_additionalServices: '',
      q8_printMaterials: '',
      q9_timeViolation: '',
      q10_workDiscipline: '',
      q11_competence: '',
      q12_materialTech: '',
      q13_satisfaction: '',
      q14_recommend: '',
      q15_age: '',
    },
  });

  const onSubmit = handleSubmit(async data => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/nok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка при отправке');
      }

      toaster.create({
        title: 'Спасибо за участие!',
        description: 'Ваше мнение очень важно для нас',
        type: 'success',
      });

      reset(); // Сбрасываем форму после успешной отправки
    } catch (error) {
      console.error('Ошибка отправки опроса:', error);

      toaster.create({
        title: 'Ошибка',
        description:
          error instanceof Error
            ? error.message
            : 'Не удалось отправить опрос. Попробуйте позже.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  const QuestionCard = ({
    number,
    title,
    name,
    options,
  }: {
    number: number;
    title: string;
    name: keyof FormValues;
    options: { value: string; label: string }[];
  }) => (
    <Card.Root>
      <CardHeader p={2}>
        <HStack>
          <Box
            bg="teal.500"
            color="white"
            borderRadius="full"
            width="30px"
            height="30px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontWeight="bold">{number}</Text>
          </Box>
          <Heading size="sm">{title}</Heading>
        </HStack>
      </CardHeader>
      <CardBody p={2}>
        <Fieldset.Root invalid={!!errors[name]}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <RadioGroup.Root
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => {
                  field.onChange(value);
                }}
              >
                <Stack gap={2}>
                  {options.map(option => (
                    <RadioGroup.Item key={option.value} value={option.value}>
                      <RadioGroup.ItemHiddenInput onBlur={field.onBlur} />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText>{option.label}</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  ))}
                </Stack>
              </RadioGroup.Root>
            )}
          />
          {errors[name] && (
            <Fieldset.ErrorText>{errors[name]?.message}</Fieldset.ErrorText>
          )}
        </Fieldset.Root>
      </CardBody>
    </Card.Root>
  );

  return (
    <Container maxW="container.lg" py={8}>
      <form onSubmit={onSubmit}>
        <VStack gap={6} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={2}>
              Независимая оценка качества
            </Heading>
            <Text color="gray.600">
              Уважаемые посетители, просим вас оценить качество работы нашей
              организации
            </Text>
          </Box>

          <Separator />

          <Alert.Root status="info" mb={4}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Внимание!</Alert.Title>
              <Alert.Description>
                Опрос могут проходить только граждане, достигшие 18-летнего
                возраста. Пожалуйста, ответьте на все вопросы.
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>

          <QuestionCard
            number={1}
            title="Оцените комфортность условий пребывания в организации"
            name="q1_comfort"
            options={ratingOptions}
          />

          <QuestionCard
            number={2}
            title="Как вы оцениваете доброжелательность и вежливость персонала организации?"
            name="q2_kindness"
            options={kindnessOptions}
          />

          <QuestionCard
            number={3}
            title="Насколько вас в целом устраивает график работы организации?"
            name="q3_schedule"
            options={scheduleOptions}
          />

          <QuestionCard
            number={4}
            title="Оцените доступность и актуальность информации о деятельности организации, размещенной на стендах, вывесках"
            name="q4_infoStands"
            options={ratingOptions}
          />

          <QuestionCard
            number={5}
            title="Оцените качество и полноту информации об организации, размещенной на официальном сайте"
            name="q5_websiteInfo"
            options={ratingOptions}
          />

          <QuestionCard
            number={6}
            title="Оцените удобство пользования электронными сервисами, предоставляемыми организацией"
            name="q6_electronicServices"
            options={ratingOptions}
          />

          <QuestionCard
            number={7}
            title="Как вы оцениваете дополнительные услуги, предоставляемые организацией и доступность их получения?"
            name="q7_additionalServices"
            options={ratingOptions}
          />

          <QuestionCard
            number={8}
            title="Оцените качество и содержание полиграфических материалов организации"
            name="q8_printMaterials"
            options={ratingOptions}
          />

          <QuestionCard
            number={9}
            title="Сталкивались ли вы с несоблюдением установленного (заявленного) времени предоставления услуг (проведения мероприятий)?"
            name="q9_timeViolation"
            options={frequencyOptions}
          />

          <QuestionCard
            number={10}
            title="Приходилось ли вам сталкиваться с тем, что сотрудники организации нарушали режим работы?"
            name="q10_workDiscipline"
            options={frequencyOptions}
          />

          <QuestionCard
            number={11}
            title="Как вы оцениваете компетентность персонала организации культуры?"
            name="q11_competence"
            options={kindnessOptions}
          />

          <QuestionCard
            number={12}
            title="Оцените материально-техническое обеспечение организации"
            name="q12_materialTech"
            options={ratingOptions}
          />

          <QuestionCard
            number={13}
            title="Насколько в целом вы удовлетворены условиями оказания услуг?"
            name="q13_satisfaction"
            options={satisfactionOptions}
          />

          <QuestionCard
            number={14}
            title="Посоветуете ли вы своим знакомым, друзьям посетить наше учреждение?"
            name="q14_recommend"
            options={recommendOptions}
          />

          <QuestionCard
            number={15}
            title="Укажите пожалуйста ваш возраст"
            name="q15_age"
            options={ageOptions}
          />

          <Button
            type="submit"
            loading={isSubmitting}
            loadingText="Отправка..."
            size="lg"
            colorScheme="teal"
          >
            Отправить опрос
          </Button>

          <Text fontSize="sm" color="gray.500" textAlign="center">
            Спасибо за ваше участие! Ваше мнение поможет нам стать лучше.
          </Text>
        </VStack>
      </form>
    </Container>
  );
}
