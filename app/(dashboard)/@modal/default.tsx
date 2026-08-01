// Nothing to show in the modal slot on routes that aren't intercepted, which
// is every route except `/inventory/new` and `/inventory/:itemId/edit` reached
// by a client navigation.

export default function ModalDefault() {
  return null;
}
