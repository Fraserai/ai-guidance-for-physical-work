export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          first_name: string | null;
          role_category_id: string | null;
          role_category_heading: string | null;
          role_name: string | null;
          custom_role: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          role_category_id: string | null;
          role_category_heading: string | null;
          role_name: string | null;
          context_note: string | null;
          started_at: string;
          ended_at: string | null;
          created_at: string;
        };
      };
      session_messages: {
        Row: {
          id: number;
          session_id: string;
          user_id: string | null;
          role: 'user' | 'assistant' | 'system';
          content: string;
          image_storage_path: string | null;
          created_at: string;
        };
      };
    };
  };
};
