import { ref } from 'vue'

// Whether the app is rendered as an embedded inline component on a host page
// (as opposed to the floating-button modal/overlay or standalone). The widget script
// (public/widget.js) appends `?embedded=true` to the iframe URL when mounting inline.
// In embedded mode the booking screen drops its card chrome (border, rounded corners,
// shadow, close button, height cap and outer spacing) and fills the host container,
// capped only by max-width.
const isEmbedded = ref<boolean>(
  new URLSearchParams(window.location.search).get('embedded') === 'true'
)

export const useEmbedded = () => ({ isEmbedded })
