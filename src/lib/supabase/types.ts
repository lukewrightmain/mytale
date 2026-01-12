export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          discord_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          discord_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          discord_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      servers: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          content: string | null;
          banner_url: string | null;
          ip_address: string;
          port: number;
          discord_url: string | null;
          website_url: string | null;
          region: string;
          game_modes: string[];
          max_players: number;
          players_online: number;
          is_online: boolean;
          is_featured: boolean;
          is_verified: boolean;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          content?: string | null;
          banner_url?: string | null;
          ip_address: string;
          port?: number;
          discord_url?: string | null;
          website_url?: string | null;
          region: string;
          game_modes?: string[];
          max_players?: number;
          players_online?: number;
          is_online?: boolean;
          is_featured?: boolean;
          is_verified?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          content?: string | null;
          banner_url?: string | null;
          ip_address?: string;
          port?: number;
          discord_url?: string | null;
          website_url?: string | null;
          region?: string;
          game_modes?: string[];
          max_players?: number;
          players_online?: number;
          is_online?: boolean;
          is_featured?: boolean;
          is_verified?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      mods: {
        Row: {
          id: string;
          author_id: string | null;
          name: string;
          slug: string;
          tagline: string | null;
          description: string | null;
          thumbnail_url: string | null;
          category: string;
          mod_type: string;
          tags: string[];
          downloads: number;
          rating: number;
          rating_count: number;
          is_featured: boolean;
          status: string;
          support_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id?: string | null;
          name: string;
          slug: string;
          tagline?: string | null;
          description?: string | null;
          thumbnail_url?: string | null;
          category: string;
          mod_type: string;
          tags?: string[];
          downloads?: number;
          rating?: number;
          rating_count?: number;
          is_featured?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string | null;
          name?: string;
          slug?: string;
          tagline?: string | null;
          description?: string | null;
          thumbnail_url?: string | null;
          category?: string;
          mod_type?: string;
          tags?: string[];
          downloads?: number;
          rating?: number;
          rating_count?: number;
          is_featured?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      mod_versions: {
        Row: {
          id: string;
          mod_id: string;
          version_number: string;
          game_version: string;
          changelog: string | null;
          download_url: string;
          file_size: number | null;
          downloads: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          mod_id: string;
          version_number: string;
          game_version: string;
          changelog?: string | null;
          download_url: string;
          file_size?: number | null;
          downloads?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          mod_id?: string;
          version_number?: string;
          game_version?: string;
          changelog?: string | null;
          download_url?: string;
          file_size?: number | null;
          downloads?: number;
          created_at?: string;
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
  };
}

