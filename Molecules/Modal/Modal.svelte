<script>/**
 * An accessible Modal component.
 *
 * Custom Events: on:closed
 *
 * @component
 */
import { createEventDispatcher, afterUpdate, getContext, onMount, onDestroy } from 'svelte';
import notProd from '../../utility/notProd';
import Button from '../../Atoms/Button/Button.svelte';
import checkModalAccessibility from './Modal.accessibility';
/**
 * Use this property to add custom classes and stylings to the component.
 */
export let className = '';
/**
 * Unqiue identifier, which is required to prevent collisions regarding the aria-labelledy and aria-describedby attributes.
 * @required
 */
export let id = '';
/**
 * Sets the aria-label of the close button
 */
export let closeLabel = 'Close modal';
/**
 * The state of the modal. Use this prop to open/close the modal.
 */
export let open = false;
/**
 * Sets the width of the modal. Can be any css property.
 */
export let width = '50%';
/**
 * Sets the height of the modal. Can be any css property.
 */
export let height = 'fit-content';
let modal;
let isProduction;
const config = getContext('rockabilityConfig');
let trapped;
const dispatch = createEventDispatcher();
onMount(async () => {
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    isProduction = config && config.isProduction ? config.isProduction : null;
    document.addEventListener('keydown', handleEscape);
    notProd(() => checkModalAccessibility(modal), isProduction);
    return () => document.removeEventListener('keydown', handleEscape);
});
afterUpdate(async () => {
    if (open) {
        trapped = trapFocus(modal);
    }
    else if (trapped) {
        trapped.onClose();
    }
});
function handleEscape(e) {
    if (e.key === 'Escape')
        closeModal();
}
function closeModal() {
    open = false;
    dispatch('closed', {
        open: open
    });
}
// Limits focusing elements to elements inside the modal.
const trapFocus = (element, prevFocusableElement = document.activeElement) => {
    const focusableEls = Array.from(element.querySelectorAll(`a[href]:not([disabled]), 
                button:not([disabled]), 
                textarea:not([disabled]), 
                input[type="text"]:not([disabled]), 
                input[type="radio"]:not([disabled]), 
                input[type="checkbox"]:not([disabled]), 
                select:not([disabled]),
                [tabindex]:not([tabindex="-1"]`));
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];
    let currentFocus = null;
    firstFocusableEl.focus();
    currentFocus = firstFocusableEl;
    const handleFocus = (e) => {
        e.preventDefault();
        // if the focused element "lives" in the modal container, focus it
        if (focusableEls.includes(e.target)) {
            currentFocus = e.target;
        }
        else {
            // if focus is outside of the container or
            // if the previously focused element was the first element then focus the last
            // element - means you were using the shift key
            if (currentFocus === firstFocusableEl) {
                lastFocusableEl.focus();
            }
            else {
                // previously the last element was focused so focus the first one, now.
                firstFocusableEl.focus();
            }
            // update the current focus var
            currentFocus = document.activeElement;
        }
    };
    document.addEventListener('focus', handleFocus, true);
    return {
        onClose: () => {
            document.removeEventListener('focus', handleFocus, true);
            prevFocusableElement.focus();
        }
    };
};
</script>

<div
	class="modal centered  {className || ''}"
	id="modal-{id}"
	class:open
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-header-{id}"
	aria-describedby="modal-content-{id}"
	aria-hidden={!open}
	bind:this={modal}
>
	<div class="backdrop centered" on:click={closeModal} />
	<div class="modal-inner-wrapper" style="width: {width}; height: {height};">
		<div class="modal-header" id="modal-header-{id}">
			<slot name="header" />
			<Button type="default" ariaLabel={closeLabel} on:click={closeModal}>
				<slot name="close-btn" />
			</Button>
		</div>
		<div class="modal-content" id="modal-content-{id}">
			<slot />
		</div>
	</div>
</div>

<style>.modal {
  display: none;
  position: fixed;
  z-index: 19;
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow-y: auto;
}

.backdrop {
  background-color: var(--modal-backdrop-color);
  position: fixed;
}

.modal-inner-wrapper {
  z-index: 19;
  border: var(--modal-border);
  border-color: var(--modal-border-color);
  border-radius: var(--modal-border-radius);
  background-color: var(--bg-color);
  color: var(--font-color);
  margin: var(--modal-margin);
  overflow-y: auto;
}

.modal-header {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background-color: var(--bg-color);
  padding: var(--modal-padding-header);
  border-bottom: var(--modal-heading-border);
  border-color: var(--modal-heading-border-color);
}

.modal-content {
  padding: var(--modal-padding-content);
}

.open {
  display: flex;
}

.centered {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
}</style>
