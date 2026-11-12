export type SessionMessageRole = 'user' | 'assistant' | 'system';

export type SessionMessage = {
  id: string;
  role: SessionMessageRole;
  content: string;
  createdAt: string;
  imageUri?: string;
  imageStoragePath?: string;
};

export type SessionRecord = {
  id: string;
  userId?: string;
  title: string;
  roleCategoryId?: string;
  roleCategoryHeading?: string;
  roleName?: string;
  contextNote?: string;
  startedAt: string;
  endedAt?: string;
  messages: SessionMessage[];
  offlineOnly?: boolean;
};
