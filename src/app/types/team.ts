// app/types/team.ts
export type Team = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  foundationDate: string | null;
  titleAwardDate: string | null;
  lastConfirmation: string | null;
  leaderName: string | null;
  leaderNameSecondary: string | null;
  participantsAge: string | null;
  content: string | null;
  imageUrl: string | null;
  isActive: boolean;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Для создания нового коллектива
export type CreateTeamInput = Omit<Team, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};

// Для обновления коллектива
export type UpdateTeamInput = Partial<CreateTeamInput>;
