import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	base: './', // fixed index.html having sources start with "/" instead of "./" which breaks everything except root deployment
	css: {
		modules: {
			localsConvention: 'camelCaseOnly',
			// or: 'camelCase' (keeps kebab-case too)
		},
	},
	build: {
		outDir: 'dist',
		chunkSizeWarningLimit: 10000
	}
})

