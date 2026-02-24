@echo off
call yarn add fomantic-ui
cd node_modules/fomantic-ui
call npx gulp install
cd ..
cd ..
cd semantic
echo { "type": "commonjs" } > package.json
call npx gulp build
cd ..
cd src
mkdir types
cd types
(
echo // If you ever import other Fomantic files, you can broaden it slightly:
echo // declare module 'fomantic-ui/dist/*';
echo.
echo //declare module 'fomantic-ui/dist/semantic.min.js';
echo // after building theme
echo declare module '*semantic/dist/semantic.min.js';
) > fomantic-ui.d.ts
cd ..
cd ..
echo ADD TO YOUR entrypoint.tsx
(
echo // import before fomantic-js
echo import $ from 'jquery';
echo.
echo // expose jQuery globally BEFORE loading Fomantic
echo (window as any).$ = $;
echo (window as any).jQuery = $;
echo.
echo // load css normally
echo //import 'fomantic-ui/dist/semantic.min.css';
echo //after building theme
echo import '../semantic/dist/semantic.min.css';
echo.
echo // IMPORTANT: load Fomantic dynamically (not static import)
echo //await import('fomantic-ui/dist/semantic.min.js');
echo //after building theme
echo await import('../semantic/dist/semantic.min.js');
)
pause