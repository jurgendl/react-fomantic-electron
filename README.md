# Project Setup Guide

This guide covers initial setup for **dependencies**, **Tailwind CSS**, and **Fomantic UI with theming** for this project.

---

## 1️⃣ Install Project Dependencies

Make sure you have Yarn installed, then run:

```bash
yarn install
```

This will install all dependencies listed in `package.json`.

---

## 3️⃣ Initialize Fomantic UI Theme

### Step 1: Install Fomantic UI

```bash
yarn add fomantic-ui
```

### Step 2: Run Fomantic UI Setup

```bash
cd node_modules/fomantic-ui
npx gulp install
```

During setup:
1. Choose **Automatic (Use default locations and all components)**  
2. Accept defaults for everything else

This will create the `semantic/` folder with all source files, themes, and `gulpfile.js`.

---

### Step 3: Configure Theme

Edit `semantic/src/theme.config`:

```less
@site : 'material';  /* Choose a theme folder from semantic/src/themes */
```

- You can override individual component themes:

```less
@button : 'github';
@menu   : 'chubby';
```

> ⚠️ If a component theme does not exist for a chosen style, the build will throw an error.

---

### Step 4: Prepare Gulp for ES Modules

If your project root uses `"type": "module"`, create a `package.json` inside `semantic/`:

```bash
cd semantic
echo { "type": "commonjs" } > package.json
```

This ensures Gulp runs correctly.

---

### Step 5: Build Fomantic CSS/JS

```bash
npx gulp build
```

- Compiles your theme into:
```
semantic/dist/semantic.min.css
semantic/dist/semantic.min.js
```

- Add src/types/fomantic-ui.d.ts and add

```
// If you ever import other Fomantic files, you can broaden it slightly:
// declare module 'fomantic-ui/dist/*';

//declare module 'fomantic-ui/dist/semantic.min.js';
// after building theme
declare module '*semantic/dist/semantic.min.js';
```

- In your React app (main.tsx), import them like this:

```ts
// import before fomantic-js
import $ from 'jquery';

// expose jQuery globally BEFORE loading Fomantic
(window as any).$ = $;
(window as any).jQuery = $;

// load css normally
//import 'fomantic-ui/dist/semantic.min.css';
//after building theme
import '../semantic/dist/semantic.min.css';

// IMPORTANT: load Fomantic dynamically (not static import)
//await import('fomantic-ui/dist/semantic.min.js');
//after building theme
await import('../semantic/dist/semantic.min.js');
```

---

### 💡 Notes

- Re-run `npx gulp build` whenever `semantic/src/theme.config` is changed.
- You can safely **ignore `semantic/dist` in Git**, only commit `theme.config` and `semantic.json`.
- You can mix themes per component (e.g., Material globals + GitHub buttons) as described above.

---

