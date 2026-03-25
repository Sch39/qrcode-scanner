<script lang="ts">
	import { fly } from 'svelte/transition';

	interface Props {
		message: string;
		type: 'success' | 'error';
		visible: boolean;
	}

	let { message, type, visible }: Props = $props();

	const bgColor = $derived(type === 'success' ? 'bg-emerald-500' : 'bg-red-500');
</script>

{#if visible}
	<div
		transition:fly={{ y: 50, duration: 300 }}
		class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform"
	>
		<div
			class="{bgColor} flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-lg"
		>
			{#if type === 'success'}
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			{:else}
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			{/if}
			{message}
		</div>
	</div>
{/if}
