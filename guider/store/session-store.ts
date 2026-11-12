import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createId } from '@/lib/id';
import { SessionMessage, SessionMessageRole, SessionRecord } from '@/types/session';

type CreateSessionPayload = {
  userId?: string;
  title: string;
  roleCategoryId?: string;
  roleCategoryHeading?: string;
  roleName?: string;
  contextNote?: string;
};

type SessionState = {
  hydrated: boolean;
  sessions: Record<string, SessionRecord>;
  activeSessionId?: string;
  setHydrated: (hydrated: boolean) => void;
  createSession: (payload: CreateSessionPayload) => SessionRecord;
  setActiveSession: (sessionId?: string) => void;
  addMessage: (sessionId: string, payload: { role: SessionMessageRole; content: string; imageUri?: string; imageStoragePath?: string }) => SessionMessage;
  updateMessageStoragePath: (sessionId: string, messageId: string, imageStoragePath: string) => void;
  markSessionOfflineOnly: (sessionId: string, offlineOnly: boolean) => void;
  endSession: (sessionId: string) => SessionRecord | undefined;
  getActiveSession: () => SessionRecord | undefined;
  getRecentSessions: () => SessionRecord[];
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      sessions: {},
      activeSessionId: undefined,
      setHydrated: (hydrated) => set({ hydrated }),
      createSession: (payload) => {
        const session: SessionRecord = {
          id: createId(),
          userId: payload.userId,
          title: payload.title,
          roleCategoryId: payload.roleCategoryId,
          roleCategoryHeading: payload.roleCategoryHeading,
          roleName: payload.roleName,
          contextNote: payload.contextNote,
          startedAt: new Date().toISOString(),
          messages: [],
          offlineOnly: false
        };

        set((state) => ({
          sessions: {
            ...state.sessions,
            [session.id]: session
          },
          activeSessionId: session.id
        }));

        return session;
      },
      setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),
      addMessage: (sessionId, payload) => {
        const message: SessionMessage = {
          id: createId(),
          role: payload.role,
          content: payload.content,
          createdAt: new Date().toISOString(),
          imageUri: payload.imageUri,
          imageStoragePath: payload.imageStoragePath
        };

        set((state) => {
          const session = state.sessions[sessionId];

          if (!session) {
            return state;
          }

          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                messages: [...session.messages, message]
              }
            }
          };
        });

        return message;
      },
      updateMessageStoragePath: (sessionId, messageId, imageStoragePath) => {
        set((state) => {
          const session = state.sessions[sessionId];

          if (!session) {
            return state;
          }

          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                messages: session.messages.map((message) =>
                  message.id === messageId ? { ...message, imageStoragePath } : message
                )
              }
            }
          };
        });
      },
      markSessionOfflineOnly: (sessionId, offlineOnly) => {
        set((state) => {
          const session = state.sessions[sessionId];

          if (!session) {
            return state;
          }

          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                offlineOnly
              }
            }
          };
        });
      },
      endSession: (sessionId) => {
        const endedAt = new Date().toISOString();
        let updated: SessionRecord | undefined;

        set((state) => {
          const session = state.sessions[sessionId];

          if (!session) {
            return state;
          }

          updated = {
            ...session,
            endedAt
          };

          return {
            sessions: {
              ...state.sessions,
              [sessionId]: updated
            },
            activeSessionId: state.activeSessionId === sessionId ? undefined : state.activeSessionId
          };
        });

        return updated;
      },
      getActiveSession: () => {
        const state = get();
        if (!state.activeSessionId) {
          return undefined;
        }

        return state.sessions[state.activeSessionId];
      },
      getRecentSessions: () => {
        const sessions = Object.values(get().sessions);
        return sessions
          .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
          .slice(0, 8);
      }
    }),
    {
      name: 'no-name-yet-session-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);
