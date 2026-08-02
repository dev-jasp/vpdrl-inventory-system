// Nothing to show in the modal slot on routes that aren't intercepted — every
// route except the item form (`/inventory/new`, `/inventory/:itemId/edit`) and
// the staff profile and form (`/staff/:staffId`, `/staff/:staffId/edit`,
// `/staff/new`) reached by a client navigation.
//
// This is the fallback for a full page load, where there is no slot state to
// recover. Closing a dialog on a navigation within the app is the catch-all
// beside it — see `[...catchAll]/page.tsx`.

export default function ModalDefault() {
  return null;
}
