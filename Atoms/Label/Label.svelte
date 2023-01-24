<script>export let showLabel = true;
export let id = '';
export let labelText = '';
export let prefix = '';
export let className = '';
</script>

<div class="label {className || ''}">
	{#if $$slots.label && showLabel}
		<label for={`${prefix}-${id}`} id={`${prefix}-label-${id}`}><slot name="label" /></label>
	{:else if showLabel}
		<label for={`${prefix}-${id}`} id={`${prefix}-label-${id}`}>{labelText}</label>
	{/if}
</div>
