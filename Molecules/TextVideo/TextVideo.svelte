<script>/**
 * An accessible Text/Video component to display videos together with text.
 * @component
 */
import { onMount, getContext } from 'svelte';
import { Swiper } from 'swiper/svelte';
import { A11y } from 'swiper';
import Slide from '../Slider/Slide.svelte';
import Button from '../../Atoms/Button/Button.svelte';
import checkTextVideoAccessibility from './TextVideo.accessibility';
import notProd from '../../utility/notProd';
const breakpointDefault = 834;
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
 * Toggle the accessibility controls for the accisible content.
 */
export let showAccessibilityControls = true;
/**
 * Settings for displayTexts and aria-labels for the accessibility controls.
 * These are of type @type {TextVideoAccessibilityControls}
 */
export let accessibilityControlsSettings = {
    videoBtn: {
        displayText: 'Video',
        ariaLabel: 'Slide to video'
    },
    textAlternativeBtn: {
        displayText: 'Text',
        ariaLabel: 'Slide to the text description of the video'
    },
    audioDescriptionBtn: {
        displayText: 'Audio',
        ariaLabel: 'Slide to the audio description of the video'
    },
    signLanguageInterpretationBtn: {
        displayText: 'Sign Language',
        ariaLabel: 'Slide to sign language interpretation of the video'
    }
};
const config = getContext('rockabilityConfig');
let swiperOptions = {
    modules: [A11y],
    a11y: {
        enabled: true
    },
    autoHeight: true,
    allowTouchMove: false,
    grabCursor: false
};
let component;
let slider;
let isMobile;
let textSection;
let mediaSection;
let isProduction;
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
    handleMobileMode();
    window.addEventListener('resize', handleMobileMode);
    notProd(() => checkTextVideoAccessibility(component, showAccessibilityControls), isProduction);
    return () => document.removeEventListener('resize', handleMobileMode);
});
function handleMobileMode() {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    if (!mediaQuery || mediaQuery.matches) {
        isMobile = false;
        if (textSection && mediaSection) {
            textSection.style.width = `${textWidth}%`;
            mediaSection.style.width = `${100 - textWidth}%`;
        }
    }
    else {
        isMobile = true;
        if (textSection && mediaSection) {
            textSection.style.width = '100%';
            mediaSection.style.width = '100%';
        }
    }
}
function handleOnAccessibilityClick(slider, index) {
    if (slider) {
        slider.slideTo(index, 200, false);
    }
}
function handleOnSwiperInit(e) {
    slider = e.detail[0];
}
</script>

<div class="text-video {className || ''}" bind:this={component} class:mobile={isMobile}>
	{#if renderTextFirst}
		<div class="text-section" bind:this={textSection}>
			<slot name="text" />
		</div>
	{/if}

	<div class="media-section" bind:this={mediaSection}>
		{#if showAccessibilityControls}
			<Swiper {...swiperOptions} on:init={handleOnSwiperInit}>
				<Slide className="text-video-slide">
					<slot name="video" />
				</Slide>
				<Slide className="text-video-slide">
					<div
						class="text-alternative accessible-alternative"
						style="height: {slider ? `${slider.height}px` : 'auto'};"
						tabindex="0"
					>
						<slot name="text-alternative" />
					</div>
				</Slide>
				<Slide className="text-video-slide ">
					<div
						class="audio-description accessible-alternative"
						style="height: {slider ? `${slider.height}px` : 'auto'};"
						tabindex="0"
					>
						<slot name="audio-description" />
					</div>
				</Slide>
				<Slide className="text-video-slide">
					<div
						class="sign-language-interpretation accessible-alternative"
						style="height: {slider ? `${slider.height}px` : 'auto'};"
						tabindex="0"
					>
						<slot name="sign-language-interpretation" />
					</div>
				</Slide>
			</Swiper>

			<div class="accessibility-controls">
				<Button
					type="default"
					ariaLabel={accessibilityControlsSettings.videoBtn.ariaLabel}
					on:click={() => handleOnAccessibilityClick(slider, 0)}
					>{accessibilityControlsSettings.videoBtn.displayText}</Button
				>
				<Button
					type="default"
					ariaLabel={accessibilityControlsSettings.textAlternativeBtn.ariaLabel}
					on:click={() => handleOnAccessibilityClick(slider, 1)}
					>{accessibilityControlsSettings.textAlternativeBtn.displayText}</Button
				>
				<Button
					type="default"
					ariaLabel={accessibilityControlsSettings.audioDescriptionBtn.ariaLabel}
					on:click={() => handleOnAccessibilityClick(slider, 2)}
					>{accessibilityControlsSettings.audioDescriptionBtn.displayText}</Button
				>
				<Button
					type="default"
					ariaLabel={accessibilityControlsSettings.signLanguageInterpretationBtn.displayText}
					on:click={() => handleOnAccessibilityClick(slider, 3)}
					>{accessibilityControlsSettings.signLanguageInterpretationBtn.displayText}</Button
				>
			</div>
		{:else}
			<slot name="video" />
		{/if}
	</div>

	{#if !renderTextFirst}
		<div class="text-section" bind:this={textSection}>
			<slot name="text" />
		</div>
	{/if}
</div>

<style>@font-face {
  font-family: "swiper-icons";
  src: url("data:application/font-woff;charset=utf-8;base64, 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") format("woff");
  font-weight: 400;
  font-style: normal;
}
:root {
  --swiper-theme-color: #007aff;
}

:global(.swiper) {
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  list-style: none;
  padding: 0;
  /* Fix of Webkit flickering */
  z-index: 1;
}
:global(.swiper-vertical) > :global(.swiper-wrapper) {
  flex-direction: column;
}
:global(.swiper-wrapper) {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  transition-property: transform;
  box-sizing: content-box;
}
:global(.swiper-android) :global(.swiper-slide),
:global(.swiper-wrapper) {
  transform: translate3d(0px, 0, 0);
}
:global(.swiper-pointer-events) {
  touch-action: pan-y;
}
:global(.swiper-pointer-events.swiper-vertical) {
  touch-action: pan-x;
}
:global(.swiper-slide) {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  position: relative;
  transition-property: transform;
}
:global(.swiper-slide-invisible-blank) {
  visibility: hidden;
}
:global(.swiper-autoheight),
:global(.swiper-autoheight) :global(.swiper-slide) {
  height: auto;
}
:global(.swiper-autoheight) :global(.swiper-wrapper) {
  align-items: flex-start;
  transition-property: transform, height;
}
:global(.swiper-backface-hidden) :global(.swiper-slide) {
  transform: translateZ(0);
  backface-visibility: hidden;
}
:global(.swiper-3d), :global(.swiper-3d.swiper-css-mode) :global(.swiper-wrapper) {
  perspective: 1200px;
}
:global(.swiper-3d) :global(.swiper-wrapper),
:global(.swiper-3d) :global(.swiper-slide),
:global(.swiper-3d) :global(.swiper-slide-shadow),
:global(.swiper-3d) :global(.swiper-slide-shadow-left),
:global(.swiper-3d) :global(.swiper-slide-shadow-right),
:global(.swiper-3d) :global(.swiper-slide-shadow-top),
:global(.swiper-3d) :global(.swiper-slide-shadow-bottom),
:global(.swiper-3d) :global(.swiper-cube-shadow) {
  transform-style: preserve-3d;
}
:global(.swiper-3d) :global(.swiper-slide-shadow),
:global(.swiper-3d) :global(.swiper-slide-shadow-left),
:global(.swiper-3d) :global(.swiper-slide-shadow-right),
:global(.swiper-3d) :global(.swiper-slide-shadow-top),
:global(.swiper-3d) :global(.swiper-slide-shadow-bottom) {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}
:global(.swiper-3d) :global(.swiper-slide-shadow) {
  background: rgba(0, 0, 0, 0.15);
}
:global(.swiper-3d) :global(.swiper-slide-shadow-left) {
  background-image: linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
}
:global(.swiper-3d) :global(.swiper-slide-shadow-right) {
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
}
:global(.swiper-3d) :global(.swiper-slide-shadow-top) {
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
}
:global(.swiper-3d) :global(.swiper-slide-shadow-bottom) {
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
}
:global(.swiper-css-mode) > :global(.swiper-wrapper) {
  overflow: auto;
  scrollbar-width: none;
  /* For Firefox */
  -ms-overflow-style: none;
  /* For Internet Explorer and Edge */
}
:global(.swiper-css-mode) > :global(.swiper-wrapper::-webkit-scrollbar) {
  display: none;
}
:global(.swiper-css-mode) > :global(.swiper-wrapper) > :global(.swiper-slide) {
  scroll-snap-align: start start;
}
:global(.swiper-horizontal.swiper-css-mode) > :global(.swiper-wrapper) {
  scroll-snap-type: x mandatory;
}
:global(.swiper-vertical.swiper-css-mode) > :global(.swiper-wrapper) {
  scroll-snap-type: y mandatory;
}
:global(.swiper-centered) > :global(.swiper-wrapper::before) {
  content: "";
  flex-shrink: 0;
  order: 9999;
}
:global(.swiper-centered.swiper-horizontal) > :global(.swiper-wrapper) > :global(.swiper-slide:first-child) {
  margin-inline-start: var(--swiper-centered-offset-before);
}
:global(.swiper-centered.swiper-horizontal) > :global(.swiper-wrapper::before) {
  height: 100%;
  width: var(--swiper-centered-offset-after);
}
:global(.swiper-centered.swiper-vertical) > :global(.swiper-wrapper) > :global(.swiper-slide:first-child) {
  margin-block-start: var(--swiper-centered-offset-before);
}
:global(.swiper-centered.swiper-vertical) > :global(.swiper-wrapper::before) {
  width: 100%;
  height: var(--swiper-centered-offset-after);
}
:global(.swiper-centered) > :global(.swiper-wrapper) > :global(.swiper-slide) {
  scroll-snap-align: center center;
}
:global(.swiper) :global(.swiper-notification) {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  opacity: 0;
  z-index: -1000;
}

.text-video {
  background-color: var(--bg-color);
  color: var(--font-color);
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.text-alternative {
  overflow-y: auto;
}

.mobile {
  flex-direction: column;
}

.accessible-alternative:focus {
  border: var(--outline);
  border-color: var(--outline-color);
  box-sizing: border-box;
}

.accessibility-controls {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 8px;
}
.accessibility-controls :global(button) {
  margin: 0 4px;
}</style>
