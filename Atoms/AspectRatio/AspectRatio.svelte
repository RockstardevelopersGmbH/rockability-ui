<script>/**
 * An AspectRatio component that can be used to force elements to a specific aspect ratio for certain breakpoints.
 * @component
 */
import { onMount, getContext } from 'svelte';
/**
 * A unique identifier used as a post fix for the css classes used in this component to avoid collisions.
 * @required
 */
export let id = '';
/**
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
let breakpoints;
onMount(async () => {
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    // Get and sort breakpoints from the config file
    let breakpointsRaw = config && config.breakpoints ? config.breakpoints : null;
    if (!breakpointsRaw) {
        console.error(`No breakpoints were configured using the RockabilityProvider component.`);
        return;
    }
    breakpoints = sortBreakpoints(breakpointsRaw);
    // Set aspect ratios
    setAspectRatio();
});
function sortBreakpoints(breakpointsRaw, asc = true) {
    let sorted = [];
    for (var bp in breakpointsRaw) {
        sorted.push([bp, breakpointsRaw[bp]]);
    }
    sorted = sorted.sort(function (a, b) {
        if (asc)
            return a[1] - b[1];
        else
            return a[1] + b[1];
    });
    let purifiedBreakpoints = {};
    sorted.forEach(function (item) {
        purifiedBreakpoints[item[0]] = item[1];
    });
    return purifiedBreakpoints;
}
// Prases the aspecRatio.breakpoint fields to numeric value and sorts the aspectRatios
function parseAspectRatios() {
    aspectRatios.forEach((ratio) => {
        let bp = breakpoints[ratio.breakpoint.toString()];
        if (bp)
            ratio.breakpoint = bp;
    });
    try {
        aspectRatios = aspectRatios.sort((a, b) => +a.breakpoint - +b.breakpoint);
    }
    catch (error) {
        console.error(`Failed to parse aspect ratios.`, error);
    }
}
function setAspectRatio() {
    if (!aspectRatios) {
        return null;
    }
    parseAspectRatios();
    let styleTag = document.createElement('style');
    let styles = `
			.aspect-ratio-wrapper-${id} {
				aspect-ratio: ${aspectRatios[0].ratio}
			}
		`;
    for (let i = 0; i < aspectRatios.length; i++) {
        let nextBp;
        let style;
        for (let k in breakpoints) {
            if (aspectRatios[i].breakpoint === k) {
                nextBp = breakpoints[k];
                break;
            }
        }
        if (!nextBp) {
            style = `@media(min-width: ${aspectRatios[i].breakpoint}px)`;
        }
        else {
            style = `@media(min-width: ${nextBp}px)`;
        }
        style += `{
						.aspect-ratio-wrapper-${id} {
							aspect-ratio: ${aspectRatios[i].ratio};
						}
					}`;
        styles += style;
    }
    styleTag.appendChild(document.createTextNode(styles));
    document.getElementsByTagName('head')[0].appendChild(styleTag);
}
</script>

<div class="aspect-ratio-wrapper aspect-ratio-wrapper-{id}">
	<slot />
</div>

<style>.aspect-ratio-wrapper {
  box-sizing: border-box;
}</style>
