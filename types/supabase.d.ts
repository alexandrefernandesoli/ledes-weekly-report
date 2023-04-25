export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
      }
      projects: {
        Row: {
          createdAt: string
          description: string
          id: string
          name: string
          type: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description: string
          id?: string
          name: string
          type: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          description?: string
          id?: string
          name?: string
          type?: string
          updatedAt?: string
        }
      }
      projects_users: {
        Row: {
          createdAt: string
          projectId: string
          role: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          projectId: string
          role?: string
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          projectId?: string
          role?: string
          updatedAt?: string
          userId?: string
        }
      }
      reports: {
        Row: {
          content: string
          createdAt: string
          id: string
          projectId: string
          submittedAt: string
          updatedAt: string
          userId: string
        }
        Insert: {
          content: string
          createdAt?: string
          id?: string
          projectId: string
          submittedAt?: string
          updatedAt?: string
          userId: string
        }
        Update: {
          content?: string
          createdAt?: string
          id?: string
          projectId?: string
          submittedAt?: string
          updatedAt?: string
          userId?: string
        }
      }
      users: {
        Row: {
          createdAt: string
          email: string
          id: string
          name: string
          role: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id?: string
          name: string
          role?: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          name?: string
          role?: string
          updatedAt?: string
        }
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
  }
}
