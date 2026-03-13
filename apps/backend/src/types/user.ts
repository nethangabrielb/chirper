interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
  cover?: string;
  onboarded: boolean;
}

export type { User };
