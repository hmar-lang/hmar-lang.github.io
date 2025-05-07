
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          name: string | null;
          bio: string | null;
          phone_number: string | null;
          facebook_url: string | null;
          instagram_url: string | null;
          youtube_url: string | null;
          created_at: string;
          updated_at: string;
          is_admin: boolean;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          name?: string | null;
          bio?: string | null;
          phone_number?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          youtube_url?: string | null;
          created_at?: string;
          updated_at?: string;
          is_admin?: boolean;
        };
        Update: {
          username?: string;
          display_name?: string;
          name?: string | null;
          bio?: string | null;
          phone_number?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          youtube_url?: string | null;
          updated_at?: string;
          is_admin?: boolean;
        };
      };
      dictionary_entries: {
        Row: {
          id: string;
          word: string;
          part_of_speech: string;
          definition: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          word: string;
          part_of_speech: string;
          definition: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          word?: string;
          part_of_speech?: string;
          definition?: string;
          updated_at?: string;
        };
      };
      pages: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          content?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
