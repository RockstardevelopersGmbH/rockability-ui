<script>/**
 * An accessible button component.
 * @component
 */
import { onMount, getContext } from 'svelte';
import checkButtonAccessibility from './Button.accessibility';
import notProd from '../../utility/notProd';
/**
 * Sets the type of the button. Valid values are:
 * 'default', 'submit', 'reset', 'cancel'
 */
export let type = 'default' || 'submit' || 'reset' || 'cancel';
/**
 * Use this property to add custom classes and stylings to the component.
 */
export let className = '';
/**
 * Use this property to define the style of the button
 * Valid values are: ['default', 'primary', 'secondary']
 *
 * If an invalid theme string is passed, the fallback will be 'default'
 */
export let theme = 'default' || 'primary' || 'secondary';
/**
 * Specifies that an input element should be disabled.
 */
export let disabled = false;
/**
 * Use this prop to set an aria-label on the button.
 * @required
 */
export let ariaLabel = null;
const validButtonTypes = ['default', 'submit', 'reset', 'cancel'];
const validButtonThemes = ['default', 'primary', 'secondary'];
let component;
const config = getContext('rockabilityConfig');
let isProduction;
onMount(async () => {
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    isProduction = config && config.isProduction ? config.isProduction : null;
    notProd(validateType, isProduction);
    notProd(validateTheme, isProduction);
    notProd(() => checkButtonAccessibility(component, theme), isProduction);
});
function validateType() {
    if (!validButtonTypes.includes(type)) {
        console.error(`The button type '${type}' is not valid. Valid button types are [${validButtonTypes}]`, component);
    }
}
function validateTheme() {
    if (!validButtonThemes.includes(theme)) {
        theme = 'default';
        console.warn(`The button theme '${theme}' is not valid. Valid button themes are [${validButtonThemes}] \n 
				The button theme was set to 'default' as a fallback solution.`, component);
    }
}
// Map the self defined button type from validButtonTypes
// to valid values of the buttons html type attribute.
const buttonType = () => {
    switch (type) {
        case 'default':
            return 'button';
        case 'cancel':
            return 'button';
        default:
            return type;
    }
};
</script>

<div class="btn {className || ''}" bind:this={component}>
	<button
		aria-label={ariaLabel}
		class={theme || null}
		type={buttonType()}
		disabled={disabled || null}
		on:click
	>
		<slot />
	</button>
</div>

<style>button {
  padding: var(--button-padding);
  border-radius: var(--button-border-radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
button:focus {
  outline: var(--outline);
  outline-color: var(--outline-color);
}
button:disabled {
  color: var(--input-disabled-color);
  background: var(--input-disabled-bg);
}
button:disabled:hover {
  color: var(--input-disabled-color);
  background: var(--input-disabled-bg);
}

@media (pointer: coarse) {
  button {
    min-height: 44px;
    min-width: 44px;
  }
}
.default {
  color: var(--input-color);
  background: var(--input-bg);
  border: var(--input-border);
  border-color: var(--input-border-color);
}
.default:hover {
  color: var(--input-color-hover);
  background: var(--input-bg-hover);
}

.secondary {
  border: var(--secondary-border);
  border-color: var(--secondary-border-color);
  color: var(--secondary-color);
  background: var(--secondary-bg);
}
.secondary:hover {
  color: var(--secondary-color-hover);
  background: var(--secondary-bg-hover);
}

.primary {
  border: var(--primary-border);
  border-color: var(--primary-border-color);
  color: var(--primary-color);
  background: var(--primary-bg);
}
.primary:hover {
  color: var(--primary-color-hover);
  background: var(--primary-bg-hover);
}</style>
