import { Card, CardTitle } from "@/components/ui/Card";
import { SUPPORT_CONTACT } from "@/data/support";

const labelClass = "text-xs font-semibold tracking-[0.12em] text-text-4";

/**
 * How to reach the team.
 *
 * The design draws the address in blue and the number in plain text; both are
 * real links here, as every other address and number in the app is — a support
 * page whose contact details cannot be tapped is a support page you have to
 * copy out by hand.
 */
export function ContactSupport() {
  return (
    <Card>
      <CardTitle>Contact support</CardTitle>

      <dl className="mt-3.5 flex flex-col gap-3">
        <div>
          <dt className={labelClass}>EMAIL</dt>
          <dd className="mt-[3px] text-[13px] font-medium">
            <a
              href={`mailto:${SUPPORT_CONTACT.email}`}
              className="text-accent-fg hover:underline"
            >
              {SUPPORT_CONTACT.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className={labelClass}>PHONE</dt>
          <dd className="mt-[3px] text-[13px] font-medium">
            {/* Spaces are for reading; `tel:` wants the digits. */}
            <a
              href={`tel:${SUPPORT_CONTACT.phone.replaceAll(" ", "")}`}
              className="hover:underline"
            >
              {SUPPORT_CONTACT.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className={labelClass}>HOURS</dt>
          <dd className="mt-[3px] text-[13px] font-medium">
            {SUPPORT_CONTACT.hours}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
