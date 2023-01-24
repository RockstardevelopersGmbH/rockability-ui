<script>/**
 * The component can be used to display any texts in an accessible way.
 * @component
 */
import { afterUpdate, onMount, getContext } from 'svelte';
import checkTextAccessibility from './Text.accessibility';
import notProd from '../../utility/notProd';
/**
 * Use this property to add custom classes and stylings to the component.
 */
export let className = '';
/**
 * Use this property to switch between the 'normal' content and the easy language content.
 */
export let easyLanguage = false;
let component;
const config = getContext('rockabilityConfig');
let isProduction;
onMount(async () => {
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    isProduction = config && config.isProduction ? config.isProduction : null;
    notProd(() => checkTextAccessibility(component, easyLanguage), isProduction);
});
afterUpdate(() => {
    notProd(() => checkTextAccessibility(component, easyLanguage), isProduction);
});
</script>

<div bind:this={component} class="text {className || ''} {easyLanguage ? 'easyLanguage' : ''}">
	{#if $$slots.easyLanguage && easyLanguage}
		<slot name="easyLanguage" />
	{:else}
		<slot />
	{/if}
</div>

<style>.text {
  text-align: var(--text-align);
  font-size: var(--font-size);
  line-height: var(--user-line-height, var(--line-height));
  color: var(--font-color);
  background-color: var(--bg-color);
  letter-spacing: var(--letter-spacing);
  word-spacing: var(--word-spacing);
  max-width: var(--max-chars-per-line);
}

.easyLanguage {
  --font-size: 1.2em;
  text-align: left;
  white-space: pre-line;
}

.text :global(p):not(:last-child) {
  margin-bottom: var(--user-paragraph-spacing, var(--paragraph-spacing));
}</style>
