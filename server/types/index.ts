export type UserRole = 'admin' | 'user';

export type User = {
  id: number;
  username: string;
  password: string;
  profile_picture: string | null;
  role: UserRole;
  created_at: Date;
};

export type Post = {
  id: number;
  title: string;
  description: string | null;
  author_id: number;
  author_username?: string;
  author_profile_picture?: string | null;
  duration_minutes: number;
  distance_km: number | null;
  date: Date;
  picture: string | null;
  created_at: Date;
};

export type Comment = {
  id: number;
  content: string;
  post_id: number;
  author_id: number;
  author_username?: string;
  author_profile_picture?: string | null;
  created_at: Date;
};

export type PublicUser = {
  id: number;
  username: string;
  role: UserRole;
  profilePicture?: string | null;
  isFollowing?: boolean;
};

export type Exercise = {
  id: number;
  name: string;
  type: string;
  duration: number;
  photo: string | null;
  created_at: Date;
};
