# zBooking widget — embedding guide

The whole zBooking app can be injected into any website with a single `<script>` tag.
The app loads inside an **isolated iframe**, so it never clashes with the host page's
CSS/JS, and no build step or bundler is needed on the host side.

Script URL (production):

```
https://trulyvolodymyr.github.io/z-booking/widget.js
```

Once the script runs it exposes two globals:

| Global | Purpose |
| --- | --- |
| `window.ZBookingConfig` | Config object you set **before** the script tag (optional). |
| `window.ZBookingWidget` | The default instance: `.open()` / `.close()`. |
| `window.ZBooking` | Factory: `.create(config)`, `.instances`, `.default`. |

---

## Option 1 — Default button at the bottom (opens a modal)

The simplest setup. Just drop in the script. The widget injects its **own floating
button** in the corner; clicking it opens the app in a fullscreen modal.

```html
<!-- Anywhere in the page (usually before </body>) -->
<script src="https://trulyvolodymyr.github.io/z-booking/widget.js"></script>
```

### Customizing the default button

Set `window.ZBookingConfig` **before** the script tag, or use `data-*` attributes on
the script tag.

**Via config object:**

```html
<script>
  window.ZBookingConfig = {
    buttonText: 'Book a service',
    buttonPosition: 'bottom-right' // bottom-right | bottom-left | top-right | top-left
  }
</script>
<script src="https://trulyvolodymyr.github.io/z-booking/widget.js"></script>
```

**Via data attributes (no separate config block):**

```html
<script
  src="https://trulyvolodymyr.github.io/z-booking/widget.js"
  data-button-text="Book a service"
  data-button-position="bottom-left"
></script>
```

**What happens:**
1. Script loads → injects the floating button + a hidden fullscreen overlay.
2. User clicks the button → overlay fades in, iframe loads the app, page scroll locks.
3. User closes via the ✕ button, clicking the dark backdrop, or pressing `Esc`.

---

## Option 2 — Your project's own button triggers the modal

Use this when you already have a "Book now" button in your design and don't want the
widget's floating button. Hide the built-in button with `hiddenButton: true`, then call
the API from your own click handler.

```html
<!-- Your own button, styled however you like -->
<button id="my-book-btn">Book now</button>

<script>
  window.ZBookingConfig = {
    hiddenButton: true // do NOT inject the floating button
  }
</script>
<script src="https://trulyvolodymyr.github.io/z-booking/widget.js"></script>

<script>
  // The script exposes window.ZBookingWidget once loaded
  document.getElementById('my-book-btn').addEventListener('click', function () {
    window.ZBookingWidget.open()
  })
</script>
```

**API available on `window.ZBookingWidget`:**

```js
window.ZBookingWidget.open()   // open the modal (loads the iframe on first open)
window.ZBookingWidget.close()  // close the modal
```

### Loading order note

`window.ZBookingWidget` only exists **after** `widget.js` has executed. If your button
handler might run earlier (e.g. the script has `async`/`defer`, or lives in a separate
bundle), guard the call:

```js
document.getElementById('my-book-btn').addEventListener('click', function () {
  if (window.ZBookingWidget) {
    window.ZBookingWidget.open()
  } else {
    console.warn('zBooking widget not ready yet')
  }
})
```

This is exactly the pattern the app's own self-test uses
(`src/App.vue`, `?widget=true` mode): it sets `hiddenButton: true`, waits for
`window.ZBookingWidget`, then calls `.open()`.

---

## Option 3 — Inject like a component into another site (inline)

Use this when you want the app to live **inside the page layout** (a panel, a section, a
column) instead of a fullscreen modal. The iframe is mounted directly into a container
element you provide — there's no floating button, no dark backdrop, and no page-scroll
lock.

```html
<!-- The host container. Give it a width/height — the app fills it. -->
<div id="booking" style="width: 480px; height: 720px;"></div>

<script>
  window.ZBookingConfig = {
    mode: 'inline',     // mount in-page instead of a modal
    target: '#booking'  // CSS selector OR a DOM element
  }
</script>
<script src="https://trulyvolodymyr.github.io/z-booking/widget.js"></script>
```

By default an inline widget **auto-opens** (loads immediately). Set `autoOpen: false` to
defer loading until you call `.open()` yourself.

### Multiple inline components on one page

Use the factory `window.ZBooking.create(config)` — each call returns its own handle and
is fully independent.

```html
<div id="left"  style="width: 420px; height: 680px;"></div>
<div id="right" style="width: 420px; height: 680px;"></div>

<script src="https://trulyvolodymyr.github.io/z-booking/widget.js"></script>
<script>
  const a = window.ZBooking.create({ mode: 'inline', target: '#left' })
  const b = window.ZBooking.create({ mode: 'inline', target: '#right', token: 'abc123' })

  // each handle: { open, close, destroy, el }
  // a.close(); a.destroy()  // remove this instance's DOM + listeners
</script>
```

> When using only `ZBooking.create(...)` for inline widgets and you do **not** want the
> default floating button to appear, include `hiddenButton: true` in
> `window.ZBookingConfig`, or simply set `mode: 'inline'` there too.

---

## Full configuration reference

All keys are optional. Set them via `window.ZBookingConfig`, `data-*` attributes on the
script, or per-instance in `ZBooking.create({...})`.

| Key | Default | Description |
| --- | --- | --- |
| `formUrl` | hosted app URL | The app URL loaded inside the iframe. |
| `buttonText` | `'Open Form'` | Text on the built-in floating button. |
| `buttonPosition` | `'bottom-right'` | `bottom-right` \| `bottom-left` \| `top-right` \| `top-left`. |
| `hiddenButton` | `false` | `true` = don't inject the floating button (open via API). |
| `mode` | `'overlay'` | `'overlay'` (fullscreen modal) \| `'inline'` (mounted in `target`). |
| `target` | `null` | CSS selector or element — **required** for inline mode. |
| `view` | `null` | Optional path segment to deep-link the iframe (e.g. `'service/tuv'`). |
| `params` | `null` | Optional object of extra query params appended to the iframe URL. |
| `token` | `null` | Optional auth token forwarded to the app as `?token=`. |
| `autoOpen` | `null` | Defaults to `true` for inline, `false` for overlay. |

`data-*` equivalents are camelCase → kebab-case: `buttonText` → `data-button-text`,
`hiddenButton` → `data-hidden-button="true"`, etc.

### Instance handle

Both `window.ZBookingWidget` (the default instance) and every `ZBooking.create(...)`
return the same shape:

```ts
{
  open(): void     // open / load
  close(): void    // close / reset
  destroy(): void  // remove DOM + listeners (and free an inline target)
  el: HTMLElement  // the widget root element
}
```
