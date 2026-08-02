/**
 * A weekly rota as seven characters, Monday first: "1" on duty, "0" off.
 * The design stores and edits it this way (`staffRaw`, and the day toggles on
 * the staff form), so `lib/staff/schedule.ts` owns reading it.
 */
export type WorkingDays = string;

export type EmploymentType = "Full-time" | "Part-time";

/** Which half of the staff list a person belongs to, per the Staff List tabs. */
export type StaffGroup = "tech" | "support";

export type Staff = {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  days: WorkingDays;
  employment: EmploymentType;
  group: StaffGroup;
  /** Zones this person covers — "Bay A", "Cold chain", … */
  areas: string[];
  /**
   * A headshot: a path under `public/staff/` — the filenames are as they were
   * downloaded, and one carries a space — or a `data:` URL for a photo attached
   * through the staff form. Render it through `photoUrl` in
   * `lib/shared/photos.ts` rather than dropping it into a URL, which `Avatar`
   * already does.
   */
  photo?: string;
};
