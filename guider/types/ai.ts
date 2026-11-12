import { SessionMessage } from '@/types/session';

export type GuidanceRequest = {
  apiKey: string;
  contextNote?: string;
  history: SessionMessage[];
  frameBase64: string;
};

export type GuidanceResponse = {
  reply: string;
};
