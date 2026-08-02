/**
 * A supplier the lab buys from.
 *
 * There is no id: the design joins items to suppliers on the name string
 * (`Item.supplier`), and the supplier form edits records keyed by the name they
 * had when it opened (`origName`). So the name is the identity here too, and
 * renaming one is the operation that has to carry its items along — which is
 * the form's problem, when the form lands.
 */
export type Supplier = {
  name: string;
  /** The person the lab actually deals with, not a switchboard. */
  contact: string;
  email: string;
  phone: string;
  /** Share of orders that arrived by the promised date, 0–100. */
  onTime: number;
  /** Typical days from placing an order to it landing on the bench. */
  leadDays: number;
};
