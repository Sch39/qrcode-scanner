import { writable } from 'svelte/store';
import type { ScanItem } from '$lib/types';

function createScanStore() {
	const { subscribe, update, set } = writable<ScanItem[]>([]);

	return {
		subscribe,

		add: (item: ScanItem) =>
			update((items) => {
				if (items.some((i) => i.raw === item.raw)) return items;
				return [...items, item];
			}),

		remove: (index: number) => update((items) => items.filter((_, i) => i !== index)),

		reset: () => set([]),

		set
	};
}

export const scanStore = createScanStore();
