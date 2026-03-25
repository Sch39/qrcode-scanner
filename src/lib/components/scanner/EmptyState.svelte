<script lang="ts">
	interface Props {
		count: number;
	}

	let { count }: Props = $props();
</script>

{#if count === 0}
	<div
		class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center"
	>
		<div class="mb-3 rounded-full bg-slate-100 p-3">
			<svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
				/>
			</svg>
		</div>
		<p class="text-sm font-medium text-slate-600">Belum ada data terscan</p>
		<p class="mt-1 text-xs text-slate-400">Arahkan kamera ke QR code untuk memulai</p>
	</div>
{/if}
