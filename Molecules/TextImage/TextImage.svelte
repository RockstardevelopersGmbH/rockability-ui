<script>/**
 * An accessible Text/Image component to display an image together with text.
 * @component
 */
import { onMount, getContext } from 'svelte';
import notProd from '../../utility/notProd';
import AspectRatio from '../../Atoms/AspectRatio/AspectRatio.svelte';
import checkTextImageAccessibility from './TextImage.accessibility';
const breakpointDefault = 834;
/**
 * The image source.
 * @required
 */
export let src = '';
/**
 * Text description of the image.
 * @required
 */
export let alt = '';
/**
 * Use this property to add custom classes and stylings to the component.
 */
export let className = '';
/**
 * Set the width of the text section in percentage. The media section will receive the remaining width.
 *
 * This is only true if the TextVideo component is NOT in mobile mode. The component will switch to the mobile mode
 * according to the set breakpoint.
 */
export let textWidth = 50;
/**
 * The breakpoint when the video and text will be displayed on top of each other instead of besides each other.
 * The approach that is used is mobile-first. So if the breakpoint is 700, the video and text will be on top of each other,
 * if the window size is smaller than 700px.
 */
export let breakpoint = breakpointDefault;
/**
 * This property can be used to set if the text should be rendered before or after the video.
 */
export let renderTextFirst = true;
/**
 * This property controls whether the text and the image will be displayed next to eacht other, or the
 * image will be displayed with full width and height with the text being on top of the image.
 */
export let fullImageMode = false;
/**
 * If this property is set to true, the TextImage component will set fullImageMode to false
 * at the mobile viewport.
 */
export let exitFullImageModeOnMobile = true;
/**
 * If aspectRatios are provided the AspectRatio component will be wrapped around the <img /> tag
 * with the corresponding configs being passed over.
 *
 * The aspect ratios are an Array of { breakpoint: number | string; ratio: number; }
 * - <strong>breakpoint</strong>: The name of the breakpoint (e.g. md).
 * - <strong>ratio</strong>: The aspect ratio.
 *
 * @example
 * If you want to have an aspect ratio of 16:9 in the 'md'-breakpoint, the config would
 * look like this: { breakpoint: 'md', ratio; 16 / 9 } or { breakpoint: 762, ratio; 16 / 9 }
 */
export let aspectRatios;
const config = getContext('rockabilityConfig');
let component;
let isMobile;
let textSection;
let mediaSection;
let isProduction;
// Save the original fullImageMode so it can be restored when leaving mobile mode.
let fullImageModeOriginal;
onMount(async () => {
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    isProduction = config && config.isProduction ? config.isProduction : null;
    // Parse breakpoint if it is a string
    if (typeof breakpoint === 'string') {
        let breakpointsRaw = config && config.breakpoints ? config.breakpoints : null;
        if (!breakpointsRaw) {
            console.error(`No breakpoints were configured using the RockabilityProvider component.`);
            return;
        }
        breakpoint = breakpointsRaw[breakpoint];
    }
    fullImageModeOriginal = fullImageMode;
    handleMobileMode();
    window.addEventListener('resize', handleMobileMode);
    notProd(() => checkTextImageAccessibility(component), isProduction);
    return () => document.removeEventListener('resize', handleMobileMode);
});
function handleMobileMode() {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    if (!mediaQuery || mediaQuery.matches) {
        isMobile = false;
        fullImageMode = fullImageModeOriginal;
        if (textSection && mediaSection) {
            if (!fullImageMode) {
                mediaSection.style.width = `${100 - textWidth}%`;
                textSection.style.width = `${textWidth}%`;
            }
        }
    }
    else {
        isMobile = true;
        if (exitFullImageModeOnMobile)
            fullImageMode = false;
        if (textSection && mediaSection) {
            textSection.style.width = '100%';
            mediaSection.style.width = '100%';
        }
    }
}
</script>

<div
	class="text-image {className || ''}"
	bind:this={component}
	class:mobile={isMobile}
	class:fullImageMode
>
	{#if renderTextFirst}
		<div class="text-section" bind:this={textSection}>
			<slot name="text" />
		</div>
	{/if}

	{#if fullImageMode}
		<div class="overlay" />
	{/if}

	<div class="media-section" bind:this={mediaSection}>
		{#if aspectRatios && aspectRatios.length > 0}
			<AspectRatio {aspectRatios}>
				<img {src} {alt} style="width: 100%; height: 100%; object-fit: cover;" />
			</AspectRatio>
		{:else}
			<img {src} {alt} />
		{/if}
	</div>

	{#if !renderTextFirst}
		<div class="text-section" bind:this={textSection}>
			<slot name="text" />
		</div>
	{/if}
</div>

<style>.text-image {
  background-color: var(--bg-color);
  color: var(--font-color);
  width: 100%;
  display: flex;
  justify-content: space-around;
  position: relative;
}

.mobile {
  flex-direction: column;
}

img {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.fullImageMode .text-section {
  position: absolute;
  z-index: 2;
  --bg-color: none;
  --font-color: var(--full-image-font);
  text-shadow: calc(-1 * var(--full-image-font-outline-width)) calc(-1 * var(--full-image-font-outline-width)) 0 var(--full-image-font-outline), var(--full-image-font-outline-width) calc(-1 * var(--full-image-font-outline-width)) 0 var(--full-image-font-outline), calc(-1 * var(--full-image-font-outline-width)) var(--full-image-font-outline-width) 0 var(--full-image-font-outline), var(--full-image-font-outline-width) var(--full-image-font-outline-width) 0 var(--full-image-font-outline);
}
.fullImageMode .overlay {
  z-index: 1;
  background-color: var(--full-image-overlay);
  position: absolute;
  width: 100%;
  height: 100%;
}
.fullImageMode .media-section {
  z-index: 0;
  width: 100%;
  height: 100%;
}</style>
