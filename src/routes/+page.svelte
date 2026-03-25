<script lang="ts">
	import { scanStore } from '$lib/stores/scanStore';
	import { parseQR } from '$lib/utils/qrparser';
	import { ScannerView, ScanItem, EmptyState, ActionBar } from '$lib/components/scanner';
	import { Header, Toast } from '$lib/components/ui';

	const API_URL = 'YOUR_APPS_SCRIPT_URL';

	let isSubmitting = $state(false);
	let toastMessage = $state('');
	let toastType = $state<'success' | 'error'>('success');
	let showToast = $state(false);

	function handleScan(text: string) {
		const parsed = parseQR(text);
		if (!parsed) {
			displayToast('Format QR tidak valid', 'error');
			return;
		}
		scanStore.add({ ...parsed, raw: text });
		displayToast('QR Code berhasil discan', 'success');
	}

	function displayToast(message: string, type: 'success' | 'error') {
		toastMessage = message;
		toastType = type;
		showToast = true;
		setTimeout(() => (showToast = false), 3000);
	}

	async function submitData() {
		if (!$scanStore.length) return;

		isSubmitting = true;
		try {
			const res = await fetch(API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: $scanStore })
			});

			if (!res.ok) throw new Error('Network error');

			const result = await res.json();
			displayToast(`Berhasil mengirim ${result.inserted} data`, 'success');
			scanStore.reset();
		} catch (e) {
			displayToast('Gagal mengirim data', 'error');
			console.error(e);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="mx-auto max-w-lg space-y-6 p-4 pb-24">
	<Header title="QR Scanner" subtitle="Scan dan kirim data dengan mudah" />

	<ScannerView onScan={handleScan} />

	{#if $scanStore.length > 0}
		<div class="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
			<div class="flex items-center gap-3">
				<div class="rounded-lg bg-blue-50 p-2">
					<svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
						/>
					</svg>
				</div>
				<div>
					<p class="text-xs text-slate-500">Total Item</p>
					<p class="text-lg font-bold text-slate-900">{$scanStore.length}</p>
				</div>
			</div>
		</div>
	{/if}

	<ActionBar
		count={$scanStore.length}
		{isSubmitting}
		onReset={() => scanStore.reset()}
		onSubmit={submitData}
	/>

	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<h2 class="text-sm font-semibold tracking-wider text-slate-500 uppercase">Data Terscan</h2>
			{#if $scanStore.length > 0}
				<span class="text-xs text-slate-400">{$scanStore.length} items</span>
			{/if}
		</div>

		<EmptyState count={$scanStore.length} />

		{#each $scanStore as item, i (i)}
			<ScanItem
				index={i}
				hari={item.hari}
				cell={item.cell}
				pasok={item.pasok}
				onDelete={(idx) => scanStore.remove(idx)}
			/>
		{/each}
	</div>
</div>

<Toast message={toastMessage} type={toastType} visible={showToast} />
