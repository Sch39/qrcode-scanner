<script lang="ts">
	import { scanStore } from '$lib/stores/scanStore';
	import { parseQR } from '$lib/utils/qrparser';
	import {
		ScannerView,
		ScanItem,
		EmptyState,
		ActionBar,
		ApiSettings
	} from '$lib/components/scanner';
	import { Header, Toast } from '$lib/components/ui';

	const DEFAULT_API_URL = '';

	let apiUrl = $state(DEFAULT_API_URL);
	let isSubmitting = $state(false);
	let toastMessage = $state('');
	let toastType = $state<'success' | 'error' | 'warning'>('success');
	let showToast = $state(false);

	function handleApiChange(newUrl: string) {
		apiUrl = newUrl;
	}

	function handleScan(text: string) {
		console.log('Scanned:', text);

		const parsed = parseQR(text);
		if (!parsed) {
			displayToast('Format QR tidak valid', 'error');
			return;
		}

		const item = { ...parsed, raw: text };
		const result = scanStore.add(item);

		console.log('Add result:', result);

		if (result.success) {
			if (result.isRescanned) {
				displayToast('Data pernah discan sebelumnya, ditambahkan kembali', 'warning');
			} else {
				displayToast('QR Code berhasil discan', 'success');
			}
		} else {
			displayToast('Data sudah ada di list!', 'warning');
		}
	}

	function displayToast(message: string, type: 'success' | 'error' | 'warning') {
		toastMessage = message;
		toastType = type;
		showToast = true;
		setTimeout(() => (showToast = false), 3000);
	}

	async function submitData() {
		if (!$scanStore.length) return;

		if (!apiUrl) {
			displayToast('Please configure API URL first', 'error');
			return;
		}

		isSubmitting = true;
		try {
			console.log(JSON.stringify({ data: $scanStore }));

			const res = await fetch(apiUrl, {
				method: 'POST',
				body: JSON.stringify({ data: $scanStore }),
				mode: 'cors',
				redirect: 'follow'
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

	<!-- API Settings - Collapsible -->
	<ApiSettings defaultUrl={DEFAULT_API_URL} onChange={handleApiChange} />

	<ScannerView onScan={handleScan} autoStart={true} />

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

		{#each $scanStore as item, i (item.raw)}
			<ScanItem
				index={i}
				hari={item.hari}
				cell={item.cell}
				pasok={item.pasok}
				onDelete={(idx) => {
					console.log('Remove index:', idx);
					scanStore.remove(idx);
				}}
			/>
		{/each}
	</div>
</div>

<Toast message={toastMessage} type={toastType} visible={showToast} />
