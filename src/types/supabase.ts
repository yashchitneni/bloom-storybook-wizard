
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
          }
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
          }
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
          style: string
          subject: string
          theme: string
        }
        Insert: {
          age_category: string
          author_id?: string | null
          child_gender: string
          child_name: string
          child_photo_url?: string | null
          created_at?: string | null
          custom_note?: string | null
          email: string
          id?: string
          message: string
          pdf_url?: string | null
          photo_url?: string | null
          status?: string
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
          }
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
          }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
