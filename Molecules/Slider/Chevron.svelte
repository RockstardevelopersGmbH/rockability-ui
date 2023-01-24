<script>import { onMount } from 'svelte';
export let direction = 'right';
export let width = '34px';
export let height = '34px';
let component;
onMount(async () => {
    component.style.setProperty('--chevron-width', width);
    component.style.setProperty('--chevron-height', height);
});
</script>

<div bind:this={component} class="slider-chevron">
	{#if direction == 'left'}
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"
			><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
				d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
			/></svg
		>
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"
			><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
				d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
			/></svg
		>
	{/if}
</div>

<style>.slider-chevron {
  width: var(--chevron-width);
  height: var(--chevron-height);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
}
.slider-chevron:focus {
  outline: var(--outline);
  outline-color: var(--outline-color);
}

@media (pointer: coarse) {
  .slider-chevron {
    min-height: 44px;
    min-width: 44px;
  }

  svg {
    min-height: 44px;
    min-width: 44px;
  }
}
.slider-chevron svg {
  width: var(--chevron-width);
  height: var(--chevron-height);
  transform: scale(0.85);
  fill: white;
  filter: drop-shadow(-1px -1px 0px #000) drop-shadow(1px -1px 0px #000) drop-shadow(1px 1px 0px #000) drop-shadow(-1px 1px 0px #000);
}</style>
