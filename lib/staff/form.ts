import { oneOf } from "@/lib/shared/params";
import type {
  EmploymentType,
  Staff,
  StaffGroup,
  WorkingDays,
} from "@/types/staff";

/**
 * The staff form, ported from the design's `staffFields`. The grid is three
 * columns wide; `span` is how many of them a field takes.
 *
 * Nothing here is set in the mono face: a name, a role and an area are prose,
 * and the phone number is the one reading the list already sets in the sans —
 * see `docs/adr/0001-typography.md`.
 */
export const STAFF_FORM_FIELDS = [
  {
    name: "name",
    label: "Full name",
    placeholder: "e.g. Amelia Okafor",
    span: 2,
  },
  { name: "role", label: "Role", placeholder: "Technician", span: 1 },
  { name: "phone", label: "Phone", placeholder: "+44 7700 900000", span: 1 },
  { name: "email", label: "Email", placeholder: "name@labtrack.io", span: 2 },
  {
    name: "areas",
    label: "Assigned areas",
    placeholder: "Bay A, Cold chain, Bench",
    span: 3,
  },
] as const;

export type StaffFormField = (typeof STAFF_FORM_FIELDS)[number];
export type StaffFormFieldName = StaffFormField["name"];

/** The design's TEAM chips — `StaffGroup` as somebody would say it aloud. */
export const GROUP_CHIPS: { value: StaffGroup; label: string }[] = [
  { value: "tech", label: "Lab technician" },
  { value: "support", label: "Support staff" },
];

/** The design's CONTRACT chips. */
export const EMPLOYMENT_TYPES: EmploymentType[] = ["Full-time", "Part-time"];

/** Monday to Friday, which is the rota a new starter opens with. */
export const DEFAULT_DAYS: WorkingDays = "1111100";

const DAYS_PATTERN = /^[01]{7}$/;

/** Enough to catch a typo; anything stricter starts rejecting real addresses. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type StaffFormErrors = Partial<
  Record<StaffFormFieldName | "form", string>
>;

export type SaveStaffState = {
  errors?: StaffFormErrors;
  /** The values as submitted, so a rejected form comes back filled in. */
  values?: Record<string, string>;
};

function text(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Read a person back off the form.
 *
 * The design fills every blank with a placeholder — an unnamed colleague is
 * saved as "New staff member" and a missing address as "—". A name and an
 * address are how anybody is found and reached again, so those two are
 * required here; the rest keep the design's fallbacks, which are reasonable
 * defaults rather than stand-ins for missing information.
 *
 * `id` comes from the caller, never from the form: an edit keeps its own, and
 * a new person is given one by the store.
 */
export function parseStaffForm(
  data: FormData,
  id: string,
):
  | { staff: Staff; errors?: never }
  | { staff?: never; errors: StaffFormErrors } {
  const errors: StaffFormErrors = {};

  const name = text(data, "name");
  if (!name) errors.name = "Give the staff member a name.";

  const email = text(data, "email");
  if (!email) errors.email = "An email address is how they get reached.";
  else if (!EMAIL.test(email)) errors.email = "That is not an email address.";

  if (Object.keys(errors).length > 0) return { errors };

  const rawDays = text(data, "days");
  const photo = text(data, "photo");

  return {
    staff: {
      id,
      name,
      role: text(data, "role") || "Technician",
      phone: text(data, "phone") || "—",
      email,
      // A rota that did not arrive intact is the default one rather than a
      // week of blanks, which would quietly take somebody off every shift.
      days: DAYS_PATTERN.test(rawDays) ? rawDays : DEFAULT_DAYS,
      employment: oneOf(
        text(data, "employment"),
        EMPLOYMENT_TYPES,
        "Full-time",
      ),
      group: oneOf(
        text(data, "group"),
        GROUP_CHIPS.map((chip) => chip.value),
        "tech",
      ),
      areas: text(data, "areas")
        .split(",")
        .map((area) => area.trim())
        .filter(Boolean),
      ...(photo ? { photo } : {}),
    },
  };
}
