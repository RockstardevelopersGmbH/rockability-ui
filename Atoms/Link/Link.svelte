<script>/**
 * An accessible anchor link component. The component supports the types [radio, checkbox]
 * Properties that have the same name as the attributes for the html input element should exhibit the same behaviour, as well.
 *
 *  @component
 */
import { onMount, getContext } from 'svelte';
import checkLinkAccessibility from './Link.accessibility';
import notProd from '../../utility/notProd';
/**
 * Use this property to add custom classes and stylings to the component.
 */
export let className = '';
/**
 * The URL that the hyperlink points to.
 * @required
 */
export let href = '';
/**
 * Provide a description for the purpose of the link.
 */
export let description = '';
/**
 * Where to display the linked URL, as the name for a browsing context (a tab, window, or <iframe>).
 */
export let target = '';
/**
 * Provide short description of an element that labels/describes the purpose of the link.
 */
export let label = '';
/**
 * The relationship of the linked URL as space-separated link types.
 */
export let rel = '';
/**
 * Inline links do not have a min-width and min-height of 44px on touchscreen devices.
 * The purpose of this property is to fulfill the success criterion https://www.w3.org/TR/WCAG21/#target-size
 */
export let inline = false;
let component;
const config = getContext('rockabilityConfig');
let isProduction;
let hreflang;
onMount(async () => {
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    isProduction = config && config.isProduction ? config.isProduction : null;
    if (!hreflang) {
        hreflang =
            config && config.langCode ? `${config.langCode.lang}-${config.langCode.country}` : null;
    }
    notProd(() => checkLinkAccessibility(component, inline), isProduction);
});
</script>

<div
	class="link {className || ''}"
	bind:this={component}
	style={inline ? 'display: inline;' : null}
>
	<a
		{href}
		rel={rel || null}
		aria-label={description && !label ? description : null}
		aria-labelledby={label || null}
		target={target || null}
		hreflang={hreflang || null}
		class=" link-a {!inline ? 'not-inline' : ''}"
		on:click
	>
		<slot />
	</a>
</div>

<style>.link-a {
  background-color: var(--bg-color);
  color: var(--link-color);
  text-decoration: none;
}
.link-a:hover {
  color: var(--link-color-hover);
}
.link-a:visited {
  color: var(--link-color-visited);
}
.link-a:visited:hover {
  color: var(--link-color-hover);
}
.link-a:focus {
  outline: var(--outline);
  outline-color: var(--outline-color);
}

.not-inline {
  display: flex;
  align-items: center;
}

@media (pointer: coarse) {
  .not-inline {
    min-height: 44px;
    min-width: 44px;
  }
}</style>
