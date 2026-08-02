import type { Supplier } from "@/types/supplier";

/**
 * Seed supplier list, standing in for the API. Ported verbatim from
 * `suppliersRaw` in `design/LabTrack Dashboard.dc.html`, on-time percentages
 * and lead times included, so the performance columns show the same numbers
 * the design was drawn against.
 *
 * The names have to match `Item.supplier` in `data/items.ts` exactly — that
 * string is the join. Two names here supply nothing in the current catalogue
 * (Sigma-Aldrich, Scientific Industries), which is real: a supplier on record
 * is not the same thing as a supplier in use.
 */
export const SUPPLIERS: Supplier[] = [
  {
    name: "Millipore Sigma",
    contact: "Nadia Farouk",
    email: "n.farouk@milliporesigma.com",
    phone: "+1 800 645 5476",
    onTime: 97,
    leadDays: 5,
  },
  {
    name: "Thermo Fisher",
    contact: "Owen Baxter",
    email: "o.baxter@thermofisher.com",
    phone: "+1 800 767 3701",
    onTime: 95,
    leadDays: 4,
  },
  {
    name: "VWR",
    contact: "Claire Dupont",
    email: "c.dupont@vwr.com",
    phone: "+1 800 932 5000",
    onTime: 91,
    leadDays: 6,
  },
  {
    name: "Bio-Rad",
    contact: "Michael Anders",
    email: "m.anders@bio-rad.com",
    phone: "+1 800 424 6723",
    onTime: 98,
    leadDays: 3,
  },
  {
    name: "New England Biolabs",
    contact: "Rina Suzuki",
    email: "r.suzuki@neb.com",
    phone: "+1 800 632 5227",
    onTime: 99,
    leadDays: 3,
  },
  {
    name: "Gibco",
    contact: "Daniel Osei",
    email: "d.osei@gibco.com",
    phone: "+1 800 955 6288",
    onTime: 94,
    leadDays: 5,
  },
  {
    name: "Sigma-Aldrich",
    contact: "Helena Kruger",
    email: "h.kruger@sial.com",
    phone: "+1 800 325 3010",
    onTime: 96,
    leadDays: 4,
  },
  {
    name: "Sartorius",
    contact: "Tomás Herrera",
    email: "t.herrera@sartorius.com",
    phone: "+49 551 308 0",
    onTime: 93,
    leadDays: 7,
  },
  {
    name: "Eppendorf",
    contact: "Ines Kovač",
    email: "i.kovac@eppendorf.com",
    phone: "+49 40 538 010",
    onTime: 97,
    leadDays: 4,
  },
  {
    name: "Corning",
    contact: "Grace Lindqvist",
    email: "g.lindqvist@corning.com",
    phone: "+1 800 222 7740",
    onTime: 92,
    leadDays: 6,
  },
  {
    name: "Kimberly-Clark",
    contact: "Paul Ekwueme",
    email: "p.ekwueme@kcc.com",
    phone: "+1 800 543 4932",
    onTime: 90,
    leadDays: 8,
  },
  {
    name: "Honeywell",
    contact: "Fatou Diallo",
    email: "f.diallo@honeywell.com",
    phone: "+1 800 601 3320",
    onTime: 95,
    leadDays: 5,
  },
  {
    name: "Fisher Scientific",
    contact: "Ben Whitfield",
    email: "b.whitfield@fishersci.com",
    phone: "+1 800 766 7000",
    onTime: 96,
    leadDays: 4,
  },
  {
    name: "Mettler Toledo",
    contact: "Anja Roos",
    email: "a.roos@mt.com",
    phone: "+41 44 944 22 11",
    onTime: 99,
    leadDays: 3,
  },
  {
    name: "Scientific Industries",
    contact: "Marco Villani",
    email: "m.villani@scientificindustries.com",
    phone: "+1 631 415 6570",
    onTime: 88,
    leadDays: 9,
  },
  {
    name: "Gilson",
    contact: "Lea Bertrand",
    email: "l.bertrand@gilson.com",
    phone: "+1 800 445 7661",
    onTime: 94,
    leadDays: 5,
  },
];
