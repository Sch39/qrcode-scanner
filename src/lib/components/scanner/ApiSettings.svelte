<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		defaultUrl?: string;
		onChange?: (url: string) => void;
	}

	let { defaultUrl = '', onChange }: Props = $props();

	let isOpen = $state(false);
	let apiUrl = $state('');
	let savedUrl = $state('');

	onMount(() => {
		// Load dari localStorage jika ada
		const stored = localStorage.getItem('api_url');
		if (stored) {
			apiUrl = stored;
			savedUrl = stored;
			onChange?.(stored);
		} else {
			apiUrl = defaultUrl;
			savedUrl = defaultUrl;
		}
	});

	function saveUrl() {
		if (apiUrl.trim()) {
			localStorage.setItem('api_url', apiUrl.trim());
			savedUrl = apiUrl.trim();
			onChange?.(apiUrl.trim());
			isOpen = false;
		}
	}

	function resetToDefault() {
		apiUrl = defaultUrl;
		localStorage.removeItem('api_url');
		savedUrl = defaultUrl;
		onChange?.(defaultUrl);
		isOpen = false;
	}

	const isUsingDefault = $derived(savedUrl === defaultUrl || !savedUrl);
	const displayUrl = $derived(savedUrl || defaultUrl);
</script>

<div class="rounded-xl border border-slate-200 bg-white shadow-sm">
	<button
		type="button"
		onclick={() => (isOpen = !isOpen)}
		class="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50"
	>
		<div class="flex items-center gap-3">
			<div class="rounded-lg bg-slate-100 p-2">
				<svg class="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
			</div>
			<div>
				<p class="text-sm font-medium text-slate-900">API Endpoint</p>
				<p class="max-w-[200px] truncate text-xs text-slate-500">
					{isUsingDefault ? 'Menggunakan default' : 'Custom URL tersimpan'}
				</p>
			</div>
		</div>
		<svg
			class="h-5 w-5 text-slate-400 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpen}
		<div transition:slide={{ duration: 200 }} class="space-y-3 border-t border-slate-100 p-4">
			<div class="space-y-2">
				<label
					for="api-url"
					class="block text-xs font-medium tracking-wider text-slate-700 uppercase"
				>
					URL API
				</label>
				<input
					id="api-url"
					type="url"
					placeholder="https://script.google.com/..."
					bind:value={apiUrl}
					class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
				{#if defaultUrl}
					<p class="text-xs text-slate-500">
						Default: <span class="font-mono text-slate-600">{defaultUrl}</span>
					</p>
				{/if}
			</div>

			<div class="flex gap-2 pt-2">
				<button
					type="button"
					onclick={saveUrl}
					disabled={!apiUrl.trim()}
					class="flex-1 cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Simpan
				</button>
				{#if !isUsingDefault}
					<button
						type="button"
						onclick={resetToDefault}
						class="cursor-pointer rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
					>
						Reset Default
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>
