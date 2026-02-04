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
      feature_modules: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          description_pl: string | null
          id: string
          is_active: boolean | null
          name: string
          name_pl: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          description_pl?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_pl: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          description_pl?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_pl?: string
        }
        Relationships: []
      }
      financial_reports: {
        Row: {
          accounts_payable: number
          accounts_receivable: number
          admin_costs: number
          created_at: string
          gross_profit: number
          id: string
          inventory_value: number
          payroll_costs: number
          period: string
          revenue: number
          user_id: string
        }
        Insert: {
          accounts_payable?: number
          accounts_receivable?: number
          admin_costs?: number
          created_at?: string
          gross_profit?: number
          id?: string
          inventory_value?: number
          payroll_costs?: number
          period: string
          revenue?: number
          user_id: string
        }
        Update: {
          accounts_payable?: number
          accounts_receivable?: number
          admin_costs?: number
          created_at?: string
          gross_profit?: number
          id?: string
          inventory_value?: number
          payroll_costs?: number
          period?: string
          revenue?: number
          user_id?: string
        }
        Relationships: []
      }
      industry_benchmarks: {
        Row: {
          avg_admin_burden: number
          avg_cash_cycle: number
          avg_efficiency: number
          avg_margin: number
          created_at: string
          id: string
          industry_name: string
          industry_type: Database["public"]["Enums"]["industry_type"]
        }
        Insert: {
          avg_admin_burden: number
          avg_cash_cycle: number
          avg_efficiency: number
          avg_margin: number
          created_at?: string
          id?: string
          industry_name: string
          industry_type: Database["public"]["Enums"]["industry_type"]
        }
        Update: {
          avg_admin_burden?: number
          avg_cash_cycle?: number
          avg_efficiency?: number
          avg_margin?: number
          created_at?: string
          id?: string
          industry_name?: string
          industry_type?: Database["public"]["Enums"]["industry_type"]
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          billing_period_end: string | null
          billing_period_start: string | null
          created_at: string | null
          currency: string | null
          due_date: string | null
          id: string
          invoice_number: string
          organization_id: string
          paid_at: string | null
          pdf_url: string | null
          status: string | null
          tax_amount: number | null
          tax_details: Json | null
        }
        Insert: {
          amount: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          organization_id: string
          paid_at?: string | null
          pdf_url?: string | null
          status?: string | null
          tax_amount?: number | null
          tax_details?: Json | null
        }
        Update: {
          amount?: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          organization_id?: string
          paid_at?: string | null
          pdf_url?: string | null
          status?: string | null
          tax_amount?: number | null
          tax_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          organization_id: string
          role: Database["public"]["Enums"]["organization_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          organization_id: string
          role?: Database["public"]["Enums"]["organization_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string
          role?: Database["public"]["Enums"]["organization_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          billing_address: Json | null
          billing_email: string | null
          created_at: string | null
          custom_features: Json | null
          id: string
          name: string
          preferred_language: string | null
          subscription_plan_id: string | null
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          billing_address?: Json | null
          billing_email?: string | null
          created_at?: string | null
          custom_features?: Json | null
          id?: string
          name: string
          preferred_language?: string | null
          subscription_plan_id?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_address?: Json | null
          billing_email?: string | null
          created_at?: string | null
          custom_features?: Json | null
          id?: string
          name?: string
          preferred_language?: string | null
          subscription_plan_id?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_subscription_plan"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_settings: {
        Row: {
          company_address: Json | null
          company_name: string | null
          created_at: string | null
          currency: string | null
          id: string
          owner_tax_residency: string | null
          supported_languages: string[] | null
          updated_at: string | null
          vat_id: string | null
          vat_rate: number | null
        }
        Insert: {
          company_address?: Json | null
          company_name?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          owner_tax_residency?: string | null
          supported_languages?: string[] | null
          updated_at?: string | null
          vat_id?: string | null
          vat_rate?: number | null
        }
        Update: {
          company_address?: Json | null
          company_name?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          owner_tax_residency?: string | null
          supported_languages?: string[] | null
          updated_at?: string | null
          vat_id?: string | null
          vat_rate?: number | null
        }
        Relationships: []
      }
      portal_staff: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["portal_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["portal_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["portal_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          id: string
          industry_type: Database["public"]["Enums"]["industry_type"] | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          id?: string
          industry_type?: Database["public"]["Enums"]["industry_type"] | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          id?: string
          industry_type?: Database["public"]["Enums"]["industry_type"] | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          billing_cycle: string | null
          created_at: string | null
          currency: string | null
          features_list: Json | null
          id: string
          is_active: boolean | null
          is_custom: boolean | null
          max_users: number | null
          name: string
          name_pl: string
          price: number
          updated_at: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string | null
          currency?: string | null
          features_list?: Json | null
          id?: string
          is_active?: boolean | null
          is_custom?: boolean | null
          max_users?: number | null
          name: string
          name_pl: string
          price?: number
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string | null
          currency?: string | null
          features_list?: Json | null
          id?: string
          is_active?: boolean | null
          is_custom?: boolean | null
          max_users?: number | null
          name?: string
          name_pl?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_org_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["organization_role"]
      }
      get_user_organization: { Args: { _user_id: string }; Returns: string }
      is_org_admin: { Args: { _user_id: string }; Returns: boolean }
      is_portal_admin: { Args: { _user_id: string }; Returns: boolean }
      is_portal_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      industry_type: "manufacturing" | "it_services" | "ecommerce"
      organization_role: "org_admin" | "cfo" | "manager" | "viewer"
      portal_role: "portal_admin" | "support" | "billing_specialist"
      subscription_tier: "free" | "starter" | "pro"
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
      industry_type: ["manufacturing", "it_services", "ecommerce"],
      organization_role: ["org_admin", "cfo", "manager", "viewer"],
      portal_role: ["portal_admin", "support", "billing_specialist"],
      subscription_tier: ["free", "starter", "pro"],
    },
  },
} as const
