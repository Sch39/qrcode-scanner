import { writable } from 'svelte/store';
import type { ScanItem } from '$lib/types';

export type AddResult =
	| { success: true; isRescanned: boolean }
	| { success: false; reason: 'duplicate' };

function createScanStore() {
	const { subscribe, update, set } = writable<ScanItem[]>([]);
	// Set untuk tracking raw data yang sudah pernah discan (termasuk yang dihapus)
	const scannedHistory = new Set<string>();

	return {
		subscribe,

		add: (item: ScanItem): AddResult => {
			let result: AddResult = { success: false, reason: 'duplicate' };

			update((items) => {
				// Cek apakah sudah ada di list saat ini
				const existsInCurrent = items.some((i) => i.raw === item.raw);

				if (existsInCurrent) {
					// Sudah ada di list saat ini, reject
					result = { success: false, reason: 'duplicate' };
					return items;
				}

				// Tidak ada di list saat ini, boleh ditambahkan
				const isRescanned = scannedHistory.has(item.raw);

				// Tambahkan ke history (atau refresh jika sudah ada)
				scannedHistory.add(item.raw);

				result = { success: true, isRescanned };
				return [...items, item];
			});

			return result;
		},

		remove: (index: number) => {
			update((items) => {
				return items.filter((_, i) => i !== index);
			});
		},

		reset: () => {
			scannedHistory.clear();
			set([]);
		},

		// Debug method
		getHistory: () => Array.from(scannedHistory)
	};
}

export const scanStore = createScanStore();
