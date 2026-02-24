// https://vite.dev/config/

import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({mode}) => {
	const isElectron = process.env.BUILD_TARGET === "electron";

	return {
		plugins: [react()],
		base: './', // fixed index.html having sources start with "/" instead of "./" which breaks everything except root deployment
		define: {
			__ELECTRON__: JSON.stringify(isElectron)
		},
		css: {
			modules: {
				localsConvention: 'camelCaseOnly', // or: 'camelCase' (keeps kebab-case too)
			},
		},
		build: {
			outDir: 'dist',
			chunkSizeWarningLimit: 10000
		}
	}
})