interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
  cover?: string;
  onboarded: boolean;
  isGuest?: boolean;
}

export type { User };
