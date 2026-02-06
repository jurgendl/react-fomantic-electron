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

## 2️⃣ Initialize Tailwind CSS

If Tailwind is not yet configured:

```bash
# Install Tailwind and PostCSS
yarn add -D tailwindcss@3 postcss autoprefixer

# Generate Tailwind config files
npx tailwindcss init -p
```

This creates:
- `tailwind.config.js`
- `postcss.config.js`

You can now use Tailwind classes in your project.

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

- Add types/fomantic-ui.d.ts and add

```
// If you ever import other Fomantic files, you can broaden it slightly:
// declare module 'fomantic-ui/dist/*';

//declare module 'fomantic-ui/dist/semantic.min.js';
// after building theme
declare module '*semantic/dist/semantic.min.js';
```

- In your React app, import them like this:

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

## 4️⃣ Development and Build Scripts

### During development

Start the Vite dev server on [http://localhost:5173](http://localhost:5173):

```bat
_client+debug.bat
```

```bash
yarn frontend
```

### Build for deployment and test

Start preview server on [http://localhost:4173](http://localhost:4173):

```bat
_client.bat
```

```bash
yarn clean
yarn build
yarn preview
```

### To create an Electron application

```bat
_electron-build-project.bat
```

```bash
node clean.cjs
yarn build
npx electron-builder
```

### Detailed description of `package.json` scripts

| Script | Command | Description |
|--------|---------|-------------|
| `frontend` | `vite` | Starts the Vite development server with hot-reloading. |
| `build` | `tsc -b && vite build` | Builds the TypeScript project and bundles frontend assets for production. |
| `preview` | `vite preview` | Serves the production build locally for testing. |
| `start` | `npm run build && electron .` | Builds the frontend and runs the Electron app for development. |
| `lint` | `eslint .` | Runs ESLint on the project source code to check for code quality and potential errors. |
| `format` | `prettier --write ./src` | Formats all source files in the `src` folder using Prettier. |
| `clean` | `node clean.cjs` | Cleans build artifacts, including Electron and frontend builds. |




