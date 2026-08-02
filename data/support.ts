/**
 * The Support page's content, ported from `faqRaw` and the contact and status
 * cards in `design/LabTrack Dashboard.dc.html`. Questions, answers, addresses
 * and hours are the design's verbatim, curly quotes and dashes included.
 *
 * Content rather than domain, so the shapes live here beside it the way
 * `ConsumptionSeries` and `SpendMonth` do, not in `types/`.
 */

export type FaqEntry = {
  question: string;
  answer: string;
};

export const FAQS: FaqEntry[] = [
  {
    question: "How do I add a new inventory item?",
    answer:
      "Go to Inventory (or any filtered view like Chemicals) and click “+ Add item” in the top right. Fill in the category, quantities and expiry or calibration date, then Save.",
  },
  {
    question: "Why does an item show as Low Stock?",
    answer:
      "An item is flagged Low Stock once its on-hand quantity drops to or below the reorder point set on that item. Update the reorder point from the item's Edit screen if it needs adjusting.",
  },
  {
    question: "How do I attach a photo to an item or staff member?",
    answer:
      "Open the item detail or the Add/Edit modal — the photo tile lets you attach a file or, for inventory items, take a photo directly from your camera.",
  },
  {
    question: "Can I change an item's zone after it's been added?",
    answer:
      "Yes. Open the item, click Edit item, and choose a new zone from the Zone dropdown — it's built from the zones already in use so labeling stays consistent.",
  },
  {
    question: "Who do I contact about a missing supplier or delivery?",
    answer:
      "Reach out to the supplier's contact on the Suppliers page, or contact VPDRL Inventory and Supplies support below if the issue is with the system itself.",
  },
];

export const SUPPORT_CONTACT = {
  email: "support@vpdrl.com",
  phone: "+1 800 552 8264",
  hours: "Mon–Fri, 8am–6pm ET",
};

/**
 * The status card. `operational` is a constant because there is nothing behind
 * it to check — no health endpoint, no incident feed. It is the design's card,
 * and the shape is what a real check would fill in.
 */
export const SYSTEM_STATUS = {
  operational: true,
  /** The design's own time of day, kept beside `TODAY`'s date. */
  checkedAt: "08:14",
};
