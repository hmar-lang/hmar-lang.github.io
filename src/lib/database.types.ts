
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          name?: string;
          bio?: string;
          phone_number?: string;
          facebook_url?: string;
          instagram_url?: string;
          youtube_url?: string;
          created_at: string;
          updated_at: string;
          is_admin: boolean;
        };
        Insert: {
          id?: string;
          username: string;
          display_name: string;
          name?: string;
          bio?: string;
          phone_number?: string;
          facebook_url?: string;
          instagram_url?: string;
          youtube_url?: string;
          created_at?: string;
          updated_at?: string;
          is_admin?: boolean;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          name?: string;
          bio?: string;
          phone_number?: string;
          facebook_url?: string;
          instagram_url?: string;
          youtube_url?: string;
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
          id?: string;
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
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          updated_at?: string;
        };
      };
    };
  };
}
