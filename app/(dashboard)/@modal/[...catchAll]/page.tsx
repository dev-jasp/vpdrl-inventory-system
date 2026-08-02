// What closes a dialog when the app navigates somewhere else.
//
// A slot keeps whatever it was last showing across a client-side navigation —
// `default.tsx` only gets a say when the state cannot be recovered at all,
// which is a full page load. So a modal opened at `/staff/:id/edit` stayed on
// screen after `saveStaff` redirected to the list, and after any sidebar link.
// Matching every other route to a page that renders nothing is what the
// parallel-routes docs prescribe for this; the intercepting routes are more
// specific, so they still win where they apply.

export default function ModalCatchAll() {
  return null;
}
