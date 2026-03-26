<script lang="ts">
	import { slide } from 'svelte/transition';

	interface Props {
		index: number;
		hari: string;
		cell: string;
		pasok: string;
		onDelete: (index: number) => void;
	}

	let { index, hari, cell, pasok, onDelete }: Props = $props();
</script>

<div
	transition:slide={{ duration: 200 }}
	class="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
>
	<div class="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-blue-500 to-indigo-600"></div>

	<div class="flex items-start justify-between gap-4">
		<div class="flex-1 space-y-1">
			<div class="flex items-center gap-2">
				<span
					class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600"
				>
					{index + 1}
				</span>
				<span class="text-xs font-medium tracking-wider text-slate-500 uppercase"
					>Item #{index + 1}</span
				>
			</div>

			<div class="grid grid-cols-3 gap-2 pt-2 text-sm">
				<div class="space-y-1">
					<span class="block text-xs text-slate-400">Hari</span>
					<span class="font-semibold text-slate-800">{hari}</span>
				</div>
				<div class="space-y-1">
					<span class="block text-xs text-slate-400">Cell</span>
					<span class="font-semibold text-slate-800">{cell}</span>
				</div>
				<div class="space-y-1">
					<span class="block text-xs text-slate-400">Pasok</span>
					<span class="font-semibold text-slate-800">{pasok}</span>
				</div>
			</div>
		</div>

		<button
			type="button"
			onclick={() => {
				console.log('Deleting index:', index); // Debug
				onDelete(index);
			}}
			class="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 active:scale-95"
			aria-label="Hapus item"
		>
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
				/>
			</svg>
		</button>
	</div>
</div>
