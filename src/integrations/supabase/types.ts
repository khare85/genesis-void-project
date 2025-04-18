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
      applications: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          id: string
          job_id: string | null
          match_score: number | null
          notes: string | null
          resume_url: string | null
          screening_score: number | null
          status: string | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          match_score?: number | null
          notes?: string | null
          resume_url?: string | null
          screening_score?: number | null
          status?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          match_score?: number | null
          notes?: string | null
          resume_url?: string | null
          screening_score?: number | null
          status?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_certificates: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          credential_id: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string
          name: string
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          credential_id?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer: string
          name: string
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          credential_id?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_certificates_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_education: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          degree: string
          description: string | null
          end_date: string | null
          id: string
          institution: string
          start_date: string | null
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          degree: string
          description?: string | null
          end_date?: string | null
          id?: string
          institution: string
          start_date?: string | null
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          degree?: string
          description?: string | null
          end_date?: string | null
          id?: string
          institution?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_education_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_experience: {
        Row: {
          candidate_id: string | null
          company: string
          created_at: string | null
          current: boolean | null
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          start_date: string
          title: string
        }
        Insert: {
          candidate_id?: string | null
          company: string
          created_at?: string | null
          current?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          start_date: string
          title: string
        }
        Update: {
          candidate_id?: string | null
          company?: string
          created_at?: string | null
          current?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          start_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_experience_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_languages: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          id: string
          language_name: string
          proficiency: string
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          language_name: string
          proficiency: string
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          language_name?: string
          proficiency?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_languages_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_projects: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          description: string | null
          id: string
          link: string | null
          technologies: string[] | null
          title: string
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          link?: string | null
          technologies?: string[] | null
          title: string
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          link?: string | null
          technologies?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_projects_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_skills: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          id: string
          skill_level: number
          skill_name: string
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          skill_level: number
          skill_name: string
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          skill_level?: number
          skill_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_skills_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_feedback: {
        Row: {
          created_at: string | null
          id: string
          interview_id: string | null
          notes: string | null
          recommendation: string | null
          reviewer_id: string | null
          score: number | null
          strengths: string[] | null
          weaknesses: string[] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interview_id?: string | null
          notes?: string | null
          recommendation?: string | null
          reviewer_id?: string | null
          score?: number | null
          strengths?: string[] | null
          weaknesses?: string[] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interview_id?: string | null
          notes?: string | null
          recommendation?: string | null
          reviewer_id?: string | null
          score?: number | null
          strengths?: string[] | null
          weaknesses?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_feedback_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          application_id: string | null
          created_at: string | null
          duration: number | null
          feedback: string | null
          id: string
          interviewer_id: string | null
          meeting_link: string | null
          scheduled_at: string | null
          status: string | null
          type: string
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          duration?: number | null
          feedback?: string | null
          id?: string
          interviewer_id?: string | null
          meeting_link?: string | null
          scheduled_at?: string | null
          status?: string | null
          type: string
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          duration?: number | null
          feedback?: string | null
          id?: string
          interviewer_id?: string | null
          meeting_link?: string | null
          scheduled_at?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          benefits: string[] | null
          category: string | null
          closingdate: string | null
          company: string
          company_logo: string | null
          created_at: string | null
          department: string | null
          description: string | null
          experience_level: string | null
          featured: boolean | null
          id: string
          level: string | null
          location: string
          logourl: string | null
          posted_by: string | null
          posteddate: string | null
          requirements: string[] | null
          responsibilities: string[] | null
          salary_range: string | null
          status: string | null
          title: string
          type: string
        }
        Insert: {
          benefits?: string[] | null
          category?: string | null
          closingdate?: string | null
          company: string
          company_logo?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          experience_level?: string | null
          featured?: boolean | null
          id?: string
          level?: string | null
          location: string
          logourl?: string | null
          posted_by?: string | null
          posteddate?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          status?: string | null
          title: string
          type: string
        }
        Update: {
          benefits?: string[] | null
          category?: string | null
          closingdate?: string | null
          company?: string
          company_logo?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          experience_level?: string | null
          featured?: boolean | null
          id?: string
          level?: string | null
          location?: string
          logourl?: string | null
          posted_by?: string | null
          posteddate?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          status?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          github_url: string | null
          id: string
          last_name: string | null
          linkedin_url: string | null
          location: string | null
          phone: string | null
          portfolio_url: string | null
          title: string | null
          twitter_url: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          github_url?: string | null
          id: string
          last_name?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          github_url?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_profile_by_email: {
        Args: { email_param: string }
        Returns: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          github_url: string | null
          id: string
          last_name: string | null
          linkedin_url: string | null
          location: string | null
          phone: string | null
          portfolio_url: string | null
          title: string | null
          twitter_url: string | null
          updated_at: string | null
        }[]
      }
      handle_new_candidate_signup: {
        Args: {
          email_param: string
          first_name_param: string
          last_name_param: string
          phone_param: string
        }
        Returns: string
      }
    }
    Enums: {
      user_role: "admin" | "hiring_manager" | "recruiter" | "candidate"
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
    Enums: {
      user_role: ["admin", "hiring_manager", "recruiter", "candidate"],
    },
  },
} as const
