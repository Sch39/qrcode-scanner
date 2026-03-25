<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ScannerService } from '$lib/utils/scanner';

	interface Props {
		onScan: (text: string) => void;
	}

	let { onScan }: Props = $props();

	let scanner = new ScannerService();
	let isLoading = $state(true);
	let hasError = $state(false);

	onMount(() => {
		try {
			scanner.start('reader', onScan);
			isLoading = false;
		} catch {
			hasError = true;
			isLoading = false;
		}
	});

	onDestroy(() => {
		scanner.stop();
	});
</script>

<div class="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-lg">
	{#if isLoading}
		<div class="absolute inset-0 flex items-center justify-center bg-slate-800">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500"
			></div>
		</div>
	{/if}

	{#if hasError}
		<div class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
			<svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
			<span class="text-sm">Kamera tidak tersedia</span>
		</div>
	{/if}

	<div id="reader" class="h-full w-full"></div>

	<!-- Scanner Frame Overlay -->
	<div class="pointer-events-none absolute inset-0">
		<div class="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2">
			<div class="absolute top-0 left-0 h-6 w-6 border-t-4 border-l-4 border-blue-500"></div>
			<div class="absolute top-0 right-0 h-6 w-6 border-t-4 border-r-4 border-blue-500"></div>
			<div class="absolute bottom-0 left-0 h-6 w-6 border-b-4 border-l-4 border-blue-500"></div>
			<div class="absolute right-0 bottom-0 h-6 w-6 border-r-4 border-b-4 border-blue-500"></div>
		</div>
	</div>
</div>
