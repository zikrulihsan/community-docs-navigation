// Ditulis tangan mengikuti supabase/migrations/*.sql.
// Setelah migration di-apply, regenerate dengan:
//   npx supabase gen types typescript --project-id <project-ref> > app/lib/database.types.ts

export type ActivityStatus =
  | 'coming_soon'
  | 'scheduled'
  | 'registration_open'
  | 'full'
  | 'completed'
  | 'cancelled';

export type ActivityMode = 'online' | 'offline' | 'hybrid';
export type RegistrationStatus = 'confirmed' | 'waitlisted' | 'cancelled';
export type Seniority = 'student' | 'junior' | 'mid' | 'senior' | 'staff' | 'manager';

type Table<Row, Required extends keyof Row, Generated extends keyof Row = never> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Omit<Row, Required | Generated>> & Partial<Pick<Row, Generated>>;
  Update: Partial<Row>;
  Relationships: [];
};

export type ActivityRow = {
  activity_type: string;
  capacity: number | null;
  created_at: string;
  description: string;
  ends_at: string | null;
  id: string;
  image_url: string | null;
  is_public: boolean;
  location: string | null;
  mode: ActivityMode | null;
  registration_closes_at: string | null;
  registration_opens_at: string | null;
  slug: string;
  speaker: string | null;
  starts_at: string | null;
  status: ActivityStatus;
  summary: string;
  timezone: string;
  title: string;
  updated_at: string;
};

export type ActivityRegistrationRow = {
  id: string;
  activity_id: string;
  user_id: string | null;
  name: string;
  email: string;
  whatsapp: string | null;
  note: string | null;
  status: RegistrationStatus;
  created_at: string;
  updated_at: string;
};

export type ActivityInterestRow = {
  id: string;
  activity_id: string;
  user_id: string | null;
  email: string;
  whatsapp: string | null;
  created_at: string;
};

export type ProfileRow = {
  id: string;
  username: string | null;
  email: string | null;
  whatsapp: string | null;
  full_name: string;
  headline: string;
  seniority: Seniority | null;
  company: string | null;
  bio: string;
  avatar_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  skills: string[];
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MembershipRow = {
  user_id: string;
  active_until: string;
  goakal_ref: string | null;
  note: string | null;
  activated_by: string | null;
  activated_at: string;
};

export type WhatsappGroupRow = {
  id: string;
  name: string;
  description: string;
  invite_url: string;
  sort_order: number;
  created_at: string;
};

export type ActivityMemberInfoRow = {
  activity_id: string;
  meeting_url: string | null;
  recording_url: string | null;
  updated_at: string;
};

type Timestamps = 'id' | 'created_at' | 'updated_at';

export type Database = {
  public: {
    Tables: {
      activities: Table<ActivityRow, 'slug' | 'title', Timestamps>;
      activity_admin_emails: Table<{ email: string; created_at: string }, 'email', 'created_at'>;
      activity_interests: Table<ActivityInterestRow, 'activity_id' | 'email', 'id' | 'created_at'>;
      activity_registrations: Table<ActivityRegistrationRow, 'activity_id' | 'name' | 'email', Timestamps>;
      profiles: Table<ProfileRow, 'id', 'created_at' | 'updated_at'>;
      memberships: Table<MembershipRow, 'user_id' | 'active_until', 'activated_at'>;
      curators: Table<{ user_id: string; created_at: string }, 'user_id', 'created_at'>;
      whatsapp_groups: Table<WhatsappGroupRow, 'name' | 'invite_url', 'id' | 'created_at'>;
      activity_member_info: Table<ActivityMemberInfoRow, 'activity_id', 'updated_at'>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_member: { Args: Record<string, never>; Returns: boolean };
      is_curator: { Args: Record<string, never>; Returns: boolean };
      join_activity: {
        Args: { p_activity_id: string; p_whatsapp?: string; p_note?: string };
        Returns: { registration_id: string; registration_status: RegistrationStatus }[];
      };
      cancel_activity_registration: { Args: { p_activity_id: string }; Returns: undefined };
      follow_activity: { Args: { p_activity_id: string }; Returns: undefined };
    };
    Enums: {
      activity_status: ActivityStatus;
      registration_status: RegistrationStatus;
      seniority: Seniority;
    };
    CompositeTypes: Record<string, never>;
  };
};
