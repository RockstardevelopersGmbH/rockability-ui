<script>/**
 * An accessible AnchorNavigation component.
 *
 * @component
 */
import { onMount, getContext } from 'svelte';
import Link from '../../Atoms/Link/Link.svelte';
import { slide } from 'svelte/transition';
import checkAnchorNavigationAccessibility from './AnchorNavigation.accessibility';
import notProd from '../../utility/notProd';
const breakpointDefault = 834;
/**
 * Use this property to add custom classes and stylings to the component.
 */
export let className = '';
/**
 * Anchors are defined by { displayName: string, href: string, description: string }.
 * - <strong>displayName</strong>: The text that is displayed.
 * - <strong>href</strong>: The link of the navigation element.
 * - <strong>description</strong>: Should describe the purpose of the link and will be used as aria-label.
 */
export let anchors = [];
/**
 * Set whether the navigation container should be sticky or not.
 */
export let sticky = false;
/**
 * The breakpoint when the navigation will change to a dropdown menu.
 * The approach that is used is mobile-first. So if the breakpoint is 700, the navigation
 * will change to dropdown if the window size is smaller than 700px.
 */
export let breakpoint = breakpointDefault;
let component;
const config = getContext('rockabilityConfig');
let isProduction;
let isMobile;
let open = false;
onMount(async () => {
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    let breakpointRaw = config && config.breakpoints ? config.breakpoints : null;
    if (!breakpointRaw || !breakpointRaw[breakpoint]) {
        console.warn(`Failed to find a breakpoint for ${breakpoint} in the configuration of the RockabilityProvider. Breakpoint is set to default value ${breakpointDefault}px`);
        breakpoint = breakpointDefault;
    }
    else {
        breakpoint = breakpointRaw[breakpoint];
    }
    getIsMobile();
    window.addEventListener('resize', getIsMobile);
    notProd(() => checkAnchorNavigationAccessibility(component), isProduction);
    return () => document.removeEventListener('resize', getIsMobile);
});
function getIsMobile() {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    if (!mediaQuery || mediaQuery.matches) {
        isMobile = false;
    }
    else {
        isMobile = true;
    }
}
function toggleDropdown() {
    open = !open;
}
function updateActive(index) {
    anchors.forEach((link) => {
        link.active = false;
    });
    anchors[index].active = true;
}
</script>

<div
	bind:this={component}
	class="anchor-navbar {className || ''} {sticky ? 'sticky' : ''}"
	class:mobile={isMobile}
>
	{#if isMobile}
		<div class="dropdown-bar">
			<button
				aria-expanded={open}
				aria-controls="anchor-navigation-dropdown"
				class="dropdown-toggle-btn"
				on:click={toggleDropdown}
			>
				<slot name="mobileMenu" />
				{#if !$$slots.mobileMenu}
					<div class="burger-menu-stripe" />
					<div class="burger-menu-stripe" />
					<div class="burger-menu-stripe" />
				{/if}
			</button>
			<div class="additional-content mobile">
				<slot name="additional-content" />
			</div>
		</div>
	{/if}

	{#if !isMobile || open}
		<div
			transition:slide
			class="dropdown"
			aria-hidden={isMobile && !open}
			id="anchor-navigation-dropdown"
			class:mobile={isMobile}
		>
			{#each anchors as anchor, i}
				<div class="link" class:active={anchor.active}>
					<Link on:click={() => updateActive(i)} href={anchor.href} description={anchor.description}
						>{anchor.displayName}</Link
					>
				</div>
			{/each}
		</div>
	{/if}
	{#if !isMobile}
		<div class="additional-content">
			<slot name="additional-content" />
		</div>
	{/if}
</div>

<style>.anchor-navbar {
  background-color: var(--bg-color);
  color: var(--font-color);
  width: 100%;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.anchor-navbar.mobile {
  display: inherit;
}

.dropdown-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.dropdown {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.dropdown.mobile {
  flex-direction: column;
  align-items: flex-start;
}

.dropdown-toggle-btn {
  background-color: white;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dropdown-toggle-btn svg {
  width: 20px;
  height: 20px;
}

.burger-menu-stripe {
  width: 24px;
  height: 2px;
  background-color: black;
  margin: 3px 0;
}

.additional-content {
  align-self: center;
}

.sticky {
  position: sticky;
  top: 0;
}

.link {
  padding: 10px;
  position: relative;
}
.link.active {
  border-bottom: 2px solid;
  border-color: var(--primary-bg);
}

.mobile .link {
  padding: 10px 0;
}
.mobile .active {
  border: none;
}

@media (pointer: coarse) {
  .dropdown-toggle-btn {
    min-height: 44px;
    min-width: 44px;
  }
}</style>
