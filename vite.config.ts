import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	optimizeDeps: {
		include: ['html5-qrcode']
	},
	build: {
		commonjsOptions: {
			include: [/html5-qrcode/, /node_modules/],
			transformMixedEsModules: true
		}
	}
});
