export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      age_categories: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      characters: {
        Row: {
          gender: string
          id: string
          is_main: boolean | null
          name: string
          photo_url: string | null
          relation: string | null
          storybook_id: string | null
        }
        Insert: {
          gender: string
          id?: string
          is_main?: boolean | null
          name: string
          photo_url?: string | null
          relation?: string | null
          storybook_id?: string | null
        }
        Update: {
          gender?: string
          id?: string
          is_main?: boolean | null
          name?: string
          photo_url?: string | null
          relation?: string | null
          storybook_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "characters_storybook_id_fkey"
            columns: ["storybook_id"]
            isOneToOne: false
            referencedRelation: "storybooks"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      story_images: {
        Row: {
          id: string
          image_url: string
          page_number: number
          storybook_id: string | null
        }
        Insert: {
          id?: string
          image_url: string
          page_number: number
          storybook_id?: string | null
        }
        Update: {
          id?: string
          image_url?: string
          page_number?: number
          storybook_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "story_images_storybook_id_fkey"
            columns: ["storybook_id"]
            isOneToOne: false
            referencedRelation: "storybooks"
            referencedColumns: ["id"]
          },
        ]
      }
      storybooks: {
        Row: {
          age_category: string
          author_id: string | null
          child_gender: string
          child_name: string
          child_photo_url: string | null
          created_at: string | null
          custom_note: string | null
          email: string
          id: string
          message: string
          pdf_url: string | null
          photo_url: string | null
          status: string
          stripe_session_id: string | null
          style: string
          subject: string
          theme: string
        }
        Insert: {
          age_category: string
          author_id?: string | null
          child_gender?: string
          child_name?: string
          child_photo_url?: string | null
          created_at?: string | null
          custom_note?: string | null
          email: string
          id?: string
          message: string
          pdf_url?: string | null
          photo_url?: string | null
          status?: string
          stripe_session_id?: string | null
          style: string
          subject: string
          theme: string
        }
        Update: {
          age_category?: string
          author_id?: string | null
          child_gender?: string
          child_name?: string
          child_photo_url?: string | null
          created_at?: string | null
          custom_note?: string | null
          email?: string
          id?: string
          message?: string
          pdf_url?: string | null
          photo_url?: string | null
          status?: string
          stripe_session_id?: string | null
          style?: string
          subject?: string
          theme?: string
        }
        Relationships: [
          {
            foreignKeyName: "storybooks_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      styles: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          name: string
          theme: string
        }
        Insert: {
          name: string
          theme: string
        }
        Update: {
          name?: string
          theme?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_theme_fkey"
            columns: ["theme"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["name"]
          },
        ]
      }
      themes: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

export interface Storybook {
  id: string;
  created_at: string;
  email: string;
  child_name: string;
  child_gender: string;
  age_category: string;
  theme: string;
  subject: string;
  message: string;
  style: string;
  custom_note: string | null;
  child_photo_url: string | null;
  status: string;
  stripe_session_id: string;
  characters: Character[];
}

export interface StorybookInsert {
  email: string;
  child_name: string;
  child_gender: string;
  age_category: string;
  theme: string;
  subject: string;
  message: string;
  style: string;
  custom_note?: string | null;
  child_photo_url?: string | null;
  status: string;
  stripe_session_id: string;
}

export interface StorybookUpdate {
  email?: string;
  child_name?: string;
  child_gender?: string;
  age_category?: string;
  theme?: string;
  subject?: string;
  message?: string;
  style?: string;
  custom_note?: string | null;
  child_photo_url?: string | null;
  status?: string;
  stripe_session_id?: string;
}
