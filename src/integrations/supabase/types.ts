export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author: string
          category: string
          content: string
          content_en: string
          content_es: string
          cover_image_url: string | null
          created_at: string
          id: string
          published: boolean
          read_time_minutes: number
          slug: string
          summary: string
          summary_en: string
          summary_es: string
          title: string
          title_en: string
          title_es: string
          updated_at: string
        }
        Insert: {
          author?: string
          category: string
          content?: string
          content_en?: string
          content_es?: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          read_time_minutes?: number
          slug: string
          summary?: string
          summary_en?: string
          summary_es?: string
          title: string
          title_en?: string
          title_es?: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          content_en?: string
          content_es?: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          read_time_minutes?: number
          slug?: string
          summary?: string
          summary_en?: string
          summary_es?: string
          title?: string
          title_en?: string
          title_es?: string
          updated_at?: string
        }
        Relationships: []
      }
      assessment_results: {
        Row: {
          answers: Json | null
          assessment_type: string
          created_at: string
          id: string
          max_score: number
          score: number
          user_id: string
        }
        Insert: {
          answers?: Json | null
          assessment_type: string
          created_at?: string
          id?: string
          max_score: number
          score: number
          user_id: string
        }
        Update: {
          answers?: Json | null
          assessment_type?: string
          created_at?: string
          id?: string
          max_score?: number
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      daily_checkins: {
        Row: {
          checkin_date: string
          created_at: string
          exercise_completed: boolean
          id: string
          mood: number
          prompt_index: number
          thought: string | null
          user_id: string
        }
        Insert: {
          checkin_date?: string
          created_at?: string
          exercise_completed?: boolean
          id?: string
          mood: number
          prompt_index?: number
          thought?: string | null
          user_id: string
        }
        Update: {
          checkin_date?: string
          created_at?: string
          exercise_completed?: boolean
          id?: string
          mood?: number
          prompt_index?: number
          thought?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_tips: {
        Row: {
          active: boolean
          created_at: string
          day_index: number
          icon: string
          id: string
          tip_en: string
          tip_es: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          day_index: number
          icon?: string
          id?: string
          tip_en?: string
          tip_es?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          day_index?: number
          icon?: string
          id?: string
          tip_en?: string
          tip_es?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string
          created_at: string
          id: string
          message: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          message: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string | null
          created_at: string
          emotion: string
          id: string
          mood: number
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          emotion: string
          id?: string
          mood: number
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          emotion?: string
          id?: string
          mood?: number
          user_id?: string
        }
        Relationships: []
      }
      journal_prompts: {
        Row: {
          active: boolean
          created_at: string
          day_index: number
          id: string
          prompt_en: string
          prompt_es: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          day_index: number
          id?: string
          prompt_en?: string
          prompt_es?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          day_index?: number
          id?: string
          prompt_en?: string
          prompt_es?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      program_days: {
        Row: {
          content: string
          day_number: number
          exercise: string
          id: string
          program_id: string
          reflection_prompt: string
          title: string
        }
        Insert: {
          content?: string
          day_number: number
          exercise?: string
          id?: string
          program_id: string
          reflection_prompt?: string
          title: string
        }
        Update: {
          content?: string
          day_number?: number
          exercise?: string
          id?: string
          program_id?: string
          reflection_prompt?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_days_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          category: string
          created_at: string
          description: string
          description_en: string
          description_es: string
          duration_days: number
          emoji: string
          id: string
          slug: string
          sort_order: number
          title: string
          title_en: string
          title_es: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          description_en?: string
          description_es?: string
          duration_days: number
          emoji?: string
          id?: string
          slug: string
          sort_order?: number
          title: string
          title_en?: string
          title_es?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          description_en?: string
          description_es?: string
          duration_days?: number
          emoji?: string
          id?: string
          slug?: string
          sort_order?: number
          title?: string
          title_en?: string
          title_es?: string
        }
        Relationships: []
      }
      user_day_completions: {
        Row: {
          completed_at: string
          day_number: number
          id: string
          program_id: string
          reflection: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          day_number: number
          id?: string
          program_id: string
          reflection?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          day_number?: number
          id?: string
          program_id?: string
          reflection?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_day_completions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_program_progress: {
        Row: {
          completed_at: string | null
          current_day: number
          id: string
          program_id: string
          started_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          current_day?: number
          id?: string
          program_id: string
          started_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          current_day?: number
          id?: string
          program_id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_program_progress_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
