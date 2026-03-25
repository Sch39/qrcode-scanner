<script lang="ts">
	interface Props {
		count: number;
		isSubmitting?: boolean;
		onReset: () => void;
		onSubmit: () => void;
	}

	let { count, isSubmitting = false, onReset, onSubmit }: Props = $props();
</script>

<div class="flex gap-3">
	<button
		onclick={onReset}
		disabled={count === 0}
		class="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
	>
		Reset
	</button>

	<button
		onclick={onSubmit}
		disabled={count === 0 || isSubmitting}
		class="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
	>
		{#if isSubmitting}
			<span class="flex items-center justify-center gap-2">
				<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Mengirim...
			</span>
		{:else}
			<span class="flex items-center justify-center gap-2">
				Kirim Data
				{#if count > 0}
					<span class="rounded-full bg-white/20 px-2 py-0.5 text-xs">{count}</span>
				{/if}
			</span>
		{/if}
	</button>
</div>
