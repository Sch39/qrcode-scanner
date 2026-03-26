<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { ScannerService } from '$lib/utils/scanner';

	interface Props {
		onScan: (text: string) => void;
		autoStart?: boolean;
	}

	let { onScan, autoStart = false }: Props = $props();

	let scanner = new ScannerService();

	let isLoading = $state(false);
	let hasError = $state(false);
	let isActive = $state(false);
	let isInitializing = $state(false);
	let readerElement: HTMLDivElement | null = null;
	let lastScanTime = 0;

	async function startScanner() {
		if (isActive || isInitializing || !readerElement) return;

		isInitializing = true;
		isLoading = true;
		hasError = false;

		try {
			await scanner.start(readerElement.id || 'qr-reader', (text) => {
				const now = Date.now();
				if (now - lastScanTime < 1000) return;
				lastScanTime = now;

				onScan(text);
			});

			isActive = true;
		} catch (err) {
			console.error(err);
			hasError = true;
			isActive = false;
		} finally {
			isLoading = false;
			isInitializing = false;
		}
	}

	async function stopScanner() {
		await scanner.stop();
		isActive = false;
	}

	async function toggleCamera() {
		if (isInitializing) return;

		if (isActive) {
			await stopScanner();
		} else {
			await new Promise((r) => setTimeout(r, 200)); // 🔥 penting
			await startScanner();
		}
	}

	onMount(() => {
		if (readerElement && !readerElement.id) {
			readerElement.id = 'qr-reader';
		}

		if (autoStart) {
			setTimeout(startScanner, 100);
		}
	});

	onDestroy(async () => {
		await scanner.destroy();
	});
</script>

<div class="overflow-hidden rounded-2xl bg-slate-900 shadow-lg">
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-slate-700/50 bg-slate-800/50 p-3">
		<div class="flex items-center gap-2">
			<div
				class="h-2 w-2 rounded-full {isActive ? 'animate-pulse bg-emerald-500' : 'bg-slate-500'}"
			></div>
			<span class="text-xs text-slate-300">
				{isActive ? 'Camera Aktif' : 'Camera Nonaktif'}
			</span>
		</div>

		<button
			onclick={toggleCamera}
			disabled={isInitializing}
			class="cursor-pointer rounded-lg px-3 py-1.5 text-xs {isActive
				? 'bg-red-500/20 text-red-400'
				: 'bg-emerald-500/20 text-emerald-400'}"
		>
			{isInitializing ? 'Memulai...' : isActive ? 'Matikan' : 'Nyalakan'}
		</button>
	</div>

	<div class="relative h-64 w-full bg-slate-950 sm:h-80">
		<!-- Camera container (TIDAK DI-HIDE) -->
		<div
			id="qr-reader"
			bind:this={readerElement}
			class="h-full w-full"
			style="opacity: {isActive ? 1 : 0};"
		></div>

		<!-- Overlay -->
		{#if isActive}
			<div transition:scale class="pointer-events-none absolute inset-0">
				<div
					class="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 border-4 border-blue-500"
				></div>
			</div>
		{/if}

		<!-- Loading -->
		{#if isLoading}
			<div class="absolute inset-0 flex items-center justify-center bg-slate-900">
				<span class="text-sm text-slate-400">Memuat camera...</span>
			</div>
		{/if}

		<!-- Error -->
		{#if hasError}
			<div class="absolute inset-0 flex flex-col items-center justify-center text-red-400">
				<p>Camera error</p>
				<button onclick={startScanner}>Retry</button>
			</div>
		{/if}
	</div>
</div>
