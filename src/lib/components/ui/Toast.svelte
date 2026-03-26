<script lang="ts">
	import { fly } from 'svelte/transition';

	interface Props {
		message: string;
		type: 'success' | 'error' | 'warning';
		visible: boolean;
	}

	let { message, type, visible }: Props = $props();

	const bgColor = $derived(
		type === 'success' ? 'bg-emerald-500' : type === 'warning' ? 'bg-amber-500' : 'bg-red-500'
	);

	const icon = $derived(type === 'success' ? 'check' : type === 'warning' ? 'exclamation' : 'x');
</script>

{#if visible}
	<div
		transition:fly={{ y: 50, duration: 300 }}
		class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform"
	>
		<div
			class="{bgColor} flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-lg"
		>
			{#if icon === 'check'}
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			{:else if icon === 'exclamation'}
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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
