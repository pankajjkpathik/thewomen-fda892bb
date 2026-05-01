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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_order_amount: number | null
          used_count: number | null
        }
        Insert: {
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          used_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          used_count?: number | null
        }
        Relationships: []
      }
      invoice_settings: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          business_name: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          footer_note: string | null
          gstin: string | null
          id: string
          invoice_prefix: string | null
          legal_name: string | null
          logo_url: string | null
          next_invoice_number: number | null
          pincode: string | null
          state: string | null
          tax_percentage: number | null
          terms_and_conditions: string | null
          updated_at: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          business_name?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          footer_note?: string | null
          gstin?: string | null
          id?: string
          invoice_prefix?: string | null
          legal_name?: string | null
          logo_url?: string | null
          next_invoice_number?: number | null
          pincode?: string | null
          state?: string | null
          tax_percentage?: number | null
          terms_and_conditions?: string | null
          updated_at?: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          business_name?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          footer_note?: string | null
          gstin?: string | null
          id?: string
          invoice_prefix?: string | null
          legal_name?: string | null
          logo_url?: string | null
          next_invoice_number?: number | null
          pincode?: string | null
          state?: string | null
          tax_percentage?: number | null
          terms_and_conditions?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          color: string | null
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_image: string | null
          product_name: string
          quantity: number
          size: string | null
          unit_price: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_image?: string | null
          product_name: string
          quantity: number
          size?: string | null
          unit_price: number
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_image?: string | null
          product_name?: string
          quantity?: number
          size?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: string | null
          billing_city: string | null
          billing_name: string | null
          billing_phone: string | null
          billing_pincode: string | null
          billing_state: string | null
          coupon_code: string | null
          created_at: string
          delivered_at: string | null
          discount_amount: number | null
          id: string
          payment_method: string | null
          payment_status: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          shipped_at: string | null
          shipping_address: string | null
          shipping_amount: number | null
          shipping_city: string | null
          shipping_name: string | null
          shipping_phone: string | null
          shipping_pincode: string | null
          shipping_state: string | null
          status: string
          total_amount: number
          tracking_id: string | null
          tracking_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address?: string | null
          billing_city?: string | null
          billing_name?: string | null
          billing_phone?: string | null
          billing_pincode?: string | null
          billing_state?: string | null
          coupon_code?: string | null
          created_at?: string
          delivered_at?: string | null
          discount_amount?: number | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_amount?: number | null
          shipping_city?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_pincode?: string | null
          shipping_state?: string | null
          status?: string
          total_amount: number
          tracking_id?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address?: string | null
          billing_city?: string | null
          billing_name?: string | null
          billing_phone?: string | null
          billing_pincode?: string | null
          billing_state?: string | null
          coupon_code?: string | null
          created_at?: string
          delivered_at?: string | null
          discount_amount?: number | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_amount?: number | null
          shipping_city?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_pincode?: string | null
          shipping_state?: string | null
          status?: string
          total_amount?: number
          tracking_id?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_settings: {
        Row: {
          bank_account_holder: string | null
          bank_account_number: string | null
          bank_ifsc: string | null
          bank_name: string | null
          id: string
          notes: string | null
          pan_number: string | null
          razorpay_key_id: string | null
          razorpay_mode: string | null
          updated_at: string
          upi_id: string | null
        }
        Insert: {
          bank_account_holder?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          id?: string
          notes?: string | null
          pan_number?: string | null
          razorpay_key_id?: string | null
          razorpay_mode?: string | null
          updated_at?: string
          upi_id?: string | null
        }
        Update: {
          bank_account_holder?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          id?: string
          notes?: string | null
          pan_number?: string | null
          razorpay_key_id?: string | null
          razorpay_mode?: string | null
          updated_at?: string
          upi_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          care_instructions: string | null
          category: string
          colors: string[] | null
          created_at: string
          default_image_index: number
          description: string | null
          fabric: string | null
          fit: string | null
          id: string
          images: string[] | null
          in_stock: boolean | null
          is_best_seller: boolean | null
          is_new: boolean | null
          name: string
          occasion: string | null
          original_price: number | null
          price: number
          seo_description: string | null
          seo_title: string | null
          sizes: string[] | null
          slug: string
          stock_quantity: number | null
          updated_at: string
          variant_stock: Json
        }
        Insert: {
          care_instructions?: string | null
          category: string
          colors?: string[] | null
          created_at?: string
          default_image_index?: number
          description?: string | null
          fabric?: string | null
          fit?: string | null
          id?: string
          images?: string[] | null
          in_stock?: boolean | null
          is_best_seller?: boolean | null
          is_new?: boolean | null
          name: string
          occasion?: string | null
          original_price?: number | null
          price: number
          seo_description?: string | null
          seo_title?: string | null
          sizes?: string[] | null
          slug: string
          stock_quantity?: number | null
          updated_at?: string
          variant_stock?: Json
        }
        Update: {
          care_instructions?: string | null
          category?: string
          colors?: string[] | null
          created_at?: string
          default_image_index?: number
          description?: string | null
          fabric?: string | null
          fit?: string | null
          id?: string
          images?: string[] | null
          in_stock?: boolean | null
          is_best_seller?: boolean | null
          is_new?: boolean | null
          name?: string
          occasion?: string | null
          original_price?: number | null
          price?: number
          seo_description?: string | null
          seo_title?: string | null
          sizes?: string[] | null
          slug?: string
          stock_quantity?: number | null
          updated_at?: string
          variant_stock?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          default_address: string | null
          default_city: string | null
          default_pincode: string | null
          default_state: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_address?: string | null
          default_city?: string | null
          default_pincode?: string | null
          default_state?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_address?: string | null
          default_city?: string | null
          default_pincode?: string | null
          default_state?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shipping_settings: {
        Row: {
          default_fee: number
          enabled: boolean
          free_shipping_threshold: number
          id: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          default_fee?: number
          enabled?: boolean
          free_shipping_threshold?: number
          id?: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          default_fee?: number
          enabled?: boolean
          free_shipping_threshold?: number
          id?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tailoring_requests: {
        Row: {
          admin_notes: string | null
          bottom_length: number | null
          bust: number | null
          color_preference: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          design_name: string
          fabric_preference: string | null
          hips: number | null
          id: string
          kurti_length: number | null
          notes: string | null
          product_id: string | null
          quoted_price: number | null
          shoulder: number | null
          sleeve_length: number | null
          status: string
          updated_at: string
          user_id: string
          waist: number | null
        }
        Insert: {
          admin_notes?: string | null
          bottom_length?: number | null
          bust?: number | null
          color_preference?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          design_name: string
          fabric_preference?: string | null
          hips?: number | null
          id?: string
          kurti_length?: number | null
          notes?: string | null
          product_id?: string | null
          quoted_price?: number | null
          shoulder?: number | null
          sleeve_length?: number | null
          status?: string
          updated_at?: string
          user_id: string
          waist?: number | null
        }
        Update: {
          admin_notes?: string | null
          bottom_length?: number | null
          bust?: number | null
          color_preference?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          design_name?: string
          fabric_preference?: string | null
          hips?: number | null
          id?: string
          kurti_length?: number | null
          notes?: string | null
          product_id?: string | null
          quoted_price?: number | null
          shoulder?: number | null
          sleeve_length?: number | null
          status?: string
          updated_at?: string
          user_id?: string
          waist?: number | null
        }
        Relationships: []
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
      admin_list_customers: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          last_address: string
          last_city: string
          last_order_at: string
          last_pincode: string
          last_state: string
          order_count: number
          phone: string
          total_spent: number
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validate_coupon: {
        Args: { _code: string; _order_amount: number }
        Returns: {
          code: string
          discount_amount: number
          discount_type: string
          discount_value: number
          is_valid: boolean
          message: string
          min_order_amount: number
        }[]
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
