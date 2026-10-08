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

/** Pertanyaan pendaftaran yang diatur admin per event (activities.registration_fields). */
export type RegistrationField = {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
};

/** Langkah tambahan di halaman "terdaftar", diatur admin per event. */
export type NextStep = { title: string; url: string; description: string };

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
  /** 0 = gratis. Event berbayar belum bisa didaftar (pembayaran segera hadir). */
  price_idr: number;
  registration_fields: RegistrationField[];
  registration_closes_at: string | null;
  registration_opens_at: string | null;
  slug: string;
  speaker: string | null;
  speaker_title: string | null;
  speaker_linkedin_url: string | null;
  /** Kosong = foto diambil otomatis dari LinkedIn. */
  speaker_photo_url: string | null;
  next_steps: NextStep[];
  /** Poin "Yang akan dibahas". */
  highlights: string[];
  /** Diisi edge function calendar-sync. */
  google_event_id: string | null;
  google_event_url: string | null;
  calendar_synced_at: string | null;
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
  /** Jawaban pertanyaan pendaftaran, { [field.id]: jawaban }. */
  answers: Record<string, string>;
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

/** Satu baris riwayat kerja di profiles.experiences. Bulan dalam format YYYY-MM. */
export type Experience = {
  role: string;
  company: string;
  start: string;
  /** null = masih bekerja di sini. */
  end: string | null;
  description: string;
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
  location: string | null;
  years_experience: number | null;
  portfolio_url: string | null;
  tech_stack: string[];
  experiences: Experience[];
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Kolom profil yang boleh tampil publik (lihat public_profile()). Tanpa WA & email. */
export type PublicProfile = Pick<
  ProfileRow,
  | 'id' | 'username' | 'full_name' | 'headline' | 'company' | 'seniority' | 'years_experience' | 'location'
  | 'avatar_url' | 'bio' | 'linkedin_url' | 'github_url' | 'portfolio_url' | 'skills' | 'tech_stack'
  | 'experiences' | 'created_at'
>;

export type MemberMotivationRow = {
  user_id: string;
  career_problem: string;
  help_wanted: string;
  join_reason: string;
  expectations: string;
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

export type ActivityLinks = {
  /** Terisi untuk peserta terkonfirmasi mulai meeting_opens_at (admin: selalu). */
  meeting_url: string | null;
  recording_url: string | null;
  has_meeting: boolean;
  has_recording: boolean;
  meeting_opens_at: string | null;
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
      member_motivations: Table<
        MemberMotivationRow,
        'career_problem' | 'help_wanted' | 'join_reason',
        'user_id' | 'created_at' | 'updated_at'
      >;
      curators: Table<{ user_id: string; created_at: string }, 'user_id', 'created_at'>;
      whatsapp_groups: Table<WhatsappGroupRow, 'name' | 'invite_url', 'id' | 'created_at'>;
      activity_member_info: Table<ActivityMemberInfoRow, 'activity_id', 'updated_at'>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_member: { Args: Record<string, never>; Returns: boolean };
      is_curator: { Args: Record<string, never>; Returns: boolean };
      has_complete_profile: { Args: Record<string, never>; Returns: boolean };
      public_profile: { Args: { p_handle: string }; Returns: PublicProfile[] };
      activity_public_stats: { Args: { p_activity_id: string }; Returns: { confirmed: number; waitlisted: number }[] };
      join_activity: {
        Args: { p_activity_id: string; p_name: string; p_whatsapp: string; p_answers?: Record<string, string> };
        Returns: { registration_id: string; registration_status: RegistrationStatus }[];
      };
      cancel_activity_registration: { Args: { p_activity_id: string }; Returns: undefined };
      follow_activity: { Args: { p_activity_id: string }; Returns: undefined };
      activity_links: {
        Args: { p_activity_id: string };
        Returns: ActivityLinks[];
      };
    };
    Enums: {
      activity_status: ActivityStatus;
      registration_status: RegistrationStatus;
      seniority: Seniority;
    };
    CompositeTypes: Record<string, never>;
  };
};
