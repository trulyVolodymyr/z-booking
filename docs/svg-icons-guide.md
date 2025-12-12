# SVG Icons Auto-Import Guide

## How it works

Your project uses `unplugin-icons` to automatically import SVG files as Vue components.

## Configuration

- **Icons location**: `/src/assets/icons/`
- **Vite config**: `vite.config.icons.ts`
- **Auto-import**: Enabled via `IconsResolverCustom()` in `vite.config.components.ts`

## Usage

### 1. Add your SVG file

Place your SVG file in `/src/assets/icons/`. For example:

```
/src/assets/icons/my-icon.svg
```

### 2. Use in Vue components

The icon will be automatically available as a component with the name pattern `Icon{FileName}`:

```vue
<template>
  <div>
    <!-- For my-icon.svg, use IconMyIcon -->
    <IconMyIcon />

    <!-- For files.svg, use IconFiles -->
    <IconFiles />

    <!-- For check-circle.svg, use IconCheckCircle -->
    <IconCheckCircle />
  </div>
</template>
```

### Naming Convention

- File name: `kebab-case.svg` (e.g., `my-icon.svg`, `check-circle.svg`)
- Component name: `PascalCase` with `Icon` prefix (e.g., `<IconMyIcon />`, `<IconCheckCircle />`)
- The conversion is automatic: `my-icon.svg` → `IconMyIcon`

## Available Icons

Current icons in `/src/assets/icons/`:

- `files.svg` → `<IconFiles />`
- `check.svg` → `<IconCheck />`
- `check-circle.svg` → `<IconCheckCircle />`
- `delete.svg` → `<IconDelete />`
- `arrow_back.svg` → `<IconArrowBack />`
- `car-profile.svg` → `<IconCarProfile />`
- `maintenance.svg` → `<IconMaintenance />`
- `wheels.svg` → `<IconWheels />`
- And more...

## Styling Icons

You can style icons using CSS classes or inline styles:

```vue
<template>
  <!-- Using CSS classes -->
  <IconFiles class="w-5 h-5 text-blue-500" />

  <!-- Using inline styles -->
  <IconFiles style="width: 20px; height: 20px; color: #1769DB;" />
</template>
```

## No Import Required!

Thanks to auto-import, you don't need to manually import icon components. Just use them directly in your template.
