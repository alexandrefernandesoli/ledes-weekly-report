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
      profile: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: string | null
        }
        Relationships: []
      }
      project: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          type?: string | null
        }
        Relationships: []
      }
      project_member: {
        Row: {
          assigned_at: string
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          project_id: string
          role?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_member_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'project'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'project_member_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
        ]
      }
      report: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'report_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'project'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'report_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
        ]
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
