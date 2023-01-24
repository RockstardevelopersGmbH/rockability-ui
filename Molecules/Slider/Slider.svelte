<script>/**
 * An accessible slider component.
 * The slider uses the Swiper API under the hood. Any properties which have the same name as a propertie in the Swiper API
 * will be forwarded to Swiper and therefore works in the same way.
 *
 * For more information see: https://swiperjs.com/swiper-api
 *
 * NOTE: Not all features of Swiper might be supported. To know which features are supported, check out the
 * properties available for this component.
 *
 *  @component
 */
import { onMount, getContext, tick } from 'svelte';
import { Swiper } from 'swiper/svelte';
import { Keyboard, A11y, Pagination, Navigation, Lazy, Autoplay } from 'swiper';
import Chevron from './Chevron.svelte';
import CheckSliderAccessibilty from './Slider.accessibility';
import notProd from '../../utility/notProd';
import { merge } from 'lodash';
import Button from '../../Atoms/Button/Button.svelte';
/**
 * options for the Swiper API.
 *
 * NOTE: The options will be deep merged with the default options.
 *
 * For more information see: https://swiperjs.com/swiper-api
 */
export let options;
/**
 * Can be used to (not) render the default navigation buttons.
 */
export let defaultNavigation = true;
/**
 * Can be used to (not) render the default pagination container.
 */
export let defaultPagination = true;
/**
 * In order to fulfill Success Criterion 2.2.2 (Pause, Stop, Hide), a play/pause button is required
 * if autplay is enabled. Set this property only to 'false' if this criterion must not be met.
 */
export let showPlayPauseButton = true;
/**
 * If autoplay is enabled, by default the pagination will be rendered left below
 * the slider and the play/pause button right below the slider. Use this property to force
 * centering the pagination bullets.
 */
export let forcePaginationCenter = false;
/**
 * Set the aria-label for the play button.
 */
export let playLabel = 'Play';
/**
 * Set the aria-label for the pause button.
 */
export let pauseLabel = 'Pause';
let component;
let swiper;
const config = getContext('rockabilityConfig');
let isProduction;
let swiperOptions = initSwiperOptions();
let hasAutoplay = false;
let paused = false;
onMount(async () => {
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    isProduction = config && config.isProduction ? config.isProduction : null;
    if (swiperOptions.autoplay) {
        if (swiperOptions.autoplay.enabled === false)
            hasAutoplay = false;
        else
            hasAutoplay = true;
    }
    // tick() is required, because otherwise CheckSliderAccessibility would fail on checkAutoplayAccessibility
    // because component.querySelector('.play-pause.btn') is null otherwise
    await tick();
    notProd(() => CheckSliderAccessibilty(component, swiperOptions, hasAutoplay), isProduction);
});
function initSwiperOptions() {
    const defaultOptions = {
        modules: [A11y, Pagination, Navigation, Keyboard, Lazy, Autoplay],
        a11y: {
            enabled: true
        },
        grabCursor: true,
        keyboard: {
            enabled: true
        },
        pagination: {
            enabled: true,
            clickable: true,
            el: '.swiper-pagination',
            type: 'bullets'
        },
        navigation: {
            enabled: true,
            prevEl: '.prev-button',
            nextEl: '.next-button'
        }
    };
    const mergedOptions = merge(defaultOptions, options);
    const prefersReducedMotionOptions = getPrefersReducedMotionOptions();
    return merge(mergedOptions, prefersReducedMotionOptions);
}
function handleOnSwiperInit(e) {
    swiper = e.detail[0];
}
function handleAutoplayPause() {
    paused = true;
}
function handleAutoplayResume() {
    paused = false;
}
function playPauseAutoplay() {
    if (paused) {
        swiper.autoplay.start();
        paused = false;
    }
    else {
        swiper.autoplay.stop();
        paused = true;
    }
}
function getPrefersReducedMotionOptions() {
    // window does not exist in SSR environments
    const canUseDOM = !!(typeof window !== 'undefined' &&
        window.document &&
        window.document.createElement);
    if (!canUseDOM)
        return {};
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // if the user asked for no anmiations:
    if (!mediaQuery || mediaQuery.matches) {
        const options = {
            speed: 0,
            autoplay: {
                enabled: false
            }
        };
        return options;
    }
    return {};
}
</script>

<div bind:this={component} class="slider">
	<div class="slider-wrapper">
		<Swiper
			{...swiperOptions}
			on:autoplayPause={handleAutoplayPause}
			on:autoplayResume={handleAutoplayResume}
			on:autoplayStart={handleAutoplayResume}
			on:autoplayStop={handleAutoplayPause}
			on:init={handleOnSwiperInit}
		>
			<slot {swiper} />
		</Swiper>

		{#if defaultNavigation}
			<div class="prev-button slider-nav">
				<Chevron direction="right" />
			</div>
			<div class="next-button slider-nav">
				<Chevron direction="left" />
			</div>
		{/if}
	</div>

	<div class="slider-controls" class:centered={forcePaginationCenter || !hasAutoplay}>
		{#if defaultPagination}
			<div class="swiper-pagination" />
		{/if}

		{#if hasAutoplay && showPlayPauseButton}
			<Button
				type="default"
				theme="default"
				className="play-pause-btn"
				ariaLabel={paused ? playLabel : pauseLabel}
				on:click={playPauseAutoplay}
			>
				{#if paused}
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"
						><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
							d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"
						/></svg
					>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"
						><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
							d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z"
						/></svg
					>
				{/if}
			</Button>
		{/if}
	</div>
	<div class="additional-controls">
		<slot name="additional-controls" />
	</div>
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
:root {
  --swiper-navigation-size: 44px;
  /*
  --swiper-navigation-color: var(--swiper-theme-color);
  */
}

:global(.swiper-button-prev),
:global(.swiper-button-next) {
  position: absolute;
  top: 50%;
  width: calc(var(--swiper-navigation-size) / 44 * 27);
  height: var(--swiper-navigation-size);
  margin-top: calc(0px - var(--swiper-navigation-size) / 2);
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--swiper-navigation-color, var(--swiper-theme-color));
}
:global(.swiper-button-prev.swiper-button-disabled),
:global(.swiper-button-next.swiper-button-disabled) {
  opacity: 0.35;
  cursor: auto;
  pointer-events: none;
}
:global(.swiper-button-prev.swiper-button-hidden),
:global(.swiper-button-next.swiper-button-hidden) {
  opacity: 0;
  cursor: auto;
  pointer-events: none;
}
.swiper-navigation-disabled :global(.swiper-button-prev),
.swiper-navigation-disabled :global(.swiper-button-next) {
  display: none !important;
}
:global(.swiper-button-prev:after),
:global(.swiper-button-next:after) {
  font-family: swiper-icons;
  font-size: var(--swiper-navigation-size);
  text-transform: none !important;
  letter-spacing: 0;
  font-variant: initial;
  line-height: 1;
}
:global(.swiper-button-prev),
:global(.swiper-rtl) :global(.swiper-button-next) {
  left: 10px;
  right: auto;
}
:global(.swiper-button-prev:after),
:global(.swiper-rtl) :global(.swiper-button-next:after) {
  content: "prev";
}
:global(.swiper-button-next),
:global(.swiper-rtl) :global(.swiper-button-prev) {
  right: 10px;
  left: auto;
}
:global(.swiper-button-next:after),
:global(.swiper-rtl) :global(.swiper-button-prev:after) {
  content: "next";
}
:global(.swiper-button-lock) {
  display: none;
}
:root {
  /*
  --swiper-pagination-color: var(--swiper-theme-color);
  --swiper-pagination-bullet-size: 8px;
  --swiper-pagination-bullet-width: 8px;
  --swiper-pagination-bullet-height: 8px;
  --swiper-pagination-bullet-inactive-color: #000;
  --swiper-pagination-bullet-inactive-opacity: 0.2;
  --swiper-pagination-bullet-opacity: 1;
  --swiper-pagination-bullet-horizontal-gap: 4px;
  --swiper-pagination-bullet-vertical-gap: 6px;
  */
}

:global(.swiper-pagination) {
  position: absolute;
  text-align: center;
  transition: 300ms opacity;
  transform: translate3d(0, 0, 0);
  z-index: 10;
}
:global(.swiper-pagination.swiper-pagination-hidden) {
  opacity: 0;
}
.swiper-pagination-disabled > :global(.swiper-pagination), :global(.swiper-pagination.swiper-pagination-disabled) {
  display: none !important;
}
:global(.swiper-pagination-fraction),
:global(.swiper-pagination-custom),
:global(.swiper-horizontal) > :global(.swiper-pagination-bullets),
:global(.swiper-pagination-bullets.swiper-pagination-horizontal) {
  bottom: 10px;
  left: 0;
  width: 100%;
}
:global(.swiper-pagination-bullets-dynamic) {
  overflow: hidden;
  font-size: 0;
}
:global(.swiper-pagination-bullets-dynamic) :global(.swiper-pagination-bullet) {
  transform: scale(0.33);
  position: relative;
}
:global(.swiper-pagination-bullets-dynamic) :global(.swiper-pagination-bullet-active) {
  transform: scale(1);
}
:global(.swiper-pagination-bullets-dynamic) :global(.swiper-pagination-bullet-active-main) {
  transform: scale(1);
}
:global(.swiper-pagination-bullets-dynamic) :global(.swiper-pagination-bullet-active-prev) {
  transform: scale(0.66);
}
:global(.swiper-pagination-bullets-dynamic) :global(.swiper-pagination-bullet-active-prev-prev) {
  transform: scale(0.33);
}
:global(.swiper-pagination-bullets-dynamic) :global(.swiper-pagination-bullet-active-next) {
  transform: scale(0.66);
}
:global(.swiper-pagination-bullets-dynamic) :global(.swiper-pagination-bullet-active-next-next) {
  transform: scale(0.33);
}
:global(.swiper-pagination-bullet) {
  width: var(--swiper-pagination-bullet-width, var(--swiper-pagination-bullet-size, 8px));
  height: var(--swiper-pagination-bullet-height, var(--swiper-pagination-bullet-size, 8px));
  display: inline-block;
  border-radius: 50%;
  background: var(--swiper-pagination-bullet-inactive-color, #000);
  opacity: var(--swiper-pagination-bullet-inactive-opacity, 0.2);
}
button :global(.swiper-pagination-bullet) {
  border: none;
  margin: 0;
  padding: 0;
  box-shadow: none;
  appearance: none;
}

.swiper-pagination-clickable :global(.swiper-pagination-bullet) {
  cursor: pointer;
}
:global(.swiper-pagination-bullet:only-child) {
  display: none !important;
}
:global(.swiper-pagination-bullet-active) {
  opacity: var(--swiper-pagination-bullet-opacity, 1);
  background: var(--swiper-pagination-color, var(--swiper-theme-color));
}
:global(.swiper-vertical) > :global(.swiper-pagination-bullets),
:global(.swiper-pagination-vertical.swiper-pagination-bullets) {
  right: 10px;
  top: 50%;
  transform: translate3d(0px, -50%, 0);
}
:global(.swiper-vertical) > :global(.swiper-pagination-bullets) :global(.swiper-pagination-bullet),
:global(.swiper-pagination-vertical.swiper-pagination-bullets) :global(.swiper-pagination-bullet) {
  margin: var(--swiper-pagination-bullet-vertical-gap, 6px) 0;
  display: block;
}
:global(.swiper-vertical) > :global(.swiper-pagination-bullets.swiper-pagination-bullets-dynamic),
:global(.swiper-pagination-vertical.swiper-pagination-bullets.swiper-pagination-bullets-dynamic) {
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
}
:global(.swiper-vertical) > :global(.swiper-pagination-bullets.swiper-pagination-bullets-dynamic) :global(.swiper-pagination-bullet),
:global(.swiper-pagination-vertical.swiper-pagination-bullets.swiper-pagination-bullets-dynamic) :global(.swiper-pagination-bullet) {
  display: inline-block;
  transition: 200ms transform, 200ms top;
}
:global(.swiper-horizontal) > :global(.swiper-pagination-bullets) :global(.swiper-pagination-bullet),
:global(.swiper-pagination-horizontal.swiper-pagination-bullets) :global(.swiper-pagination-bullet) {
  margin: 0 var(--swiper-pagination-bullet-horizontal-gap, 4px);
}
:global(.swiper-horizontal) > :global(.swiper-pagination-bullets.swiper-pagination-bullets-dynamic),
:global(.swiper-pagination-horizontal.swiper-pagination-bullets.swiper-pagination-bullets-dynamic) {
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}
:global(.swiper-horizontal) > :global(.swiper-pagination-bullets.swiper-pagination-bullets-dynamic) :global(.swiper-pagination-bullet),
:global(.swiper-pagination-horizontal.swiper-pagination-bullets.swiper-pagination-bullets-dynamic) :global(.swiper-pagination-bullet) {
  transition: 200ms transform, 200ms left;
}
:global(.swiper-horizontal.swiper-rtl) > :global(.swiper-pagination-bullets-dynamic) :global(.swiper-pagination-bullet) {
  transition: 200ms transform, 200ms right;
}
:global(.swiper-pagination-progressbar) {
  background: rgba(0, 0, 0, 0.25);
  position: absolute;
}
:global(.swiper-pagination-progressbar) :global(.swiper-pagination-progressbar-fill) {
  background: var(--swiper-pagination-color, var(--swiper-theme-color));
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform: scale(0);
  transform-origin: left top;
}
.swiper-rtl :global(.swiper-pagination-progressbar) :global(.swiper-pagination-progressbar-fill) {
  transform-origin: right top;
}
.swiper-horizontal > :global(.swiper-pagination-progressbar), :global(.swiper-pagination-progressbar.swiper-pagination-horizontal), .swiper-vertical > :global(.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite), :global(.swiper-pagination-progressbar.swiper-pagination-vertical.swiper-pagination-progressbar-opposite) {
  width: 100%;
  height: 4px;
  left: 0;
  top: 0;
}
.swiper-vertical > :global(.swiper-pagination-progressbar), :global(.swiper-pagination-progressbar.swiper-pagination-vertical), .swiper-horizontal > :global(.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite), :global(.swiper-pagination-progressbar.swiper-pagination-horizontal.swiper-pagination-progressbar-opposite) {
  width: 4px;
  height: 100%;
  left: 0;
  top: 0;
}
:global(.swiper-pagination-lock) {
  display: none;
}
:root {
  /*
  --swiper-preloader-color: var(--swiper-theme-color);
  */
}

:global(.swiper-lazy-preloader) {
  width: 42px;
  height: 42px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -21px;
  margin-top: -21px;
  z-index: 10;
  transform-origin: 50%;
  box-sizing: border-box;
  border: 4px solid var(--swiper-preloader-color, var(--swiper-theme-color));
  border-radius: 50%;
  border-top-color: transparent;
}
:global(.swiper:not(.swiper-watch-progress)) :global(.swiper-lazy-preloader),
:global(.swiper-watch-progress) :global(.swiper-slide-visible) :global(.swiper-lazy-preloader) {
  animation: swiper-preloader-spin 1s infinite linear;
}
:global(.swiper-lazy-preloader-white) {
  --swiper-preloader-color: #fff;
}
:global(.swiper-lazy-preloader-black) {
  --swiper-preloader-color: #000;
}
@keyframes swiper-preloader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.slider {
  background-color: var(--bg-color);
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  flex-wrap: wrap;
}

.slider-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.slider-nav {
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.slider-nav:global(.swiper-button-disabled) {
  display: none;
}

.next-button {
  position: absolute;
  right: 8px;
}

.prev-button {
  position: absolute;
  left: 8px;
}

.swiper-pagination {
  position: relative;
  width: auto;
  margin-top: auto;
  margin-bottom: auto;
  bottom: auto;
}
.swiper-pagination :global(.swiper-pagination-bullet) {
  cursor: pointer;
  background-color: var(--slider-pagination-inactive-color);
  opacity: 1;
  border: var(--slider-pagination-bullet-border);
  border-color: var(--slider-pagination-bullet-border-color);
}
.swiper-pagination :global(.swiper-pagination-bullet):focus {
  outline: var(--outline);
  outline-color: var(--outline-color);
  background-color: var(--slider-pagination-inactive-color);
}
.swiper-pagination :global(.swiper-pagination-bullet-active) {
  background-color: var(--slider-pagination-active-color);
}
.swiper-pagination :global(.swiper-pagination-bullet-active):focus {
  background-color: var(--slider-pagination-active-color);
  opacity: 1;
}

:global(.play-pause-btn) svg {
  height: 20px;
  width: 20px;
}

.slider-controls {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  justify-content: space-between;
  margin-top: 10px;
}

.additional-controls {
  width: 100%;
}

.centered {
  justify-content: center;
}

@media (pointer: coarse) {
  .slider {
    padding-bottom: 50px;
  }
}</style>
