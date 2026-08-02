import { ContactSupport } from "@/components/support/ContactSupport";
import { Faq } from "@/components/support/Faq";
import { SystemStatus } from "@/components/support/SystemStatus";
import { FAQS } from "@/data/support";

// Support — FAQ accordion, contact channels, system status. Ported from
// `isSupport` in `LabTrack Dashboard.dc.html`; the content is `faqRaw` and the
// two cards beside it, in `data/support.ts`.

export default function SupportPage() {
  return (
    <div className="flex flex-col gap-[18px] pt-3">
      {/* No h1: `PageTitle` already renders "Support" in the topbar, where the
          design has no topbar title and pairs this line with its own heading. */}
      <p className="text-[13px] font-normal text-text-3">
        Answers and ways to reach the VPDRL Inventory and Supplies team
      </p>

      {/* The design's 1.6fr / 1fr split, with the cards top-aligned so the
          right column doesn't stretch to the accordion's height. */}
      <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start gap-5">
        <Faq entries={FAQS} />

        <div className="flex flex-col gap-5">
          <ContactSupport />
          <SystemStatus />
        </div>
      </div>
    </div>
  );
}
