<script>/**
 * With the TextManipulator the custom CSS properties --line-spacing and --paragraph-spacing can be set by the end-user.
 * @component
 */
import { afterUpdate, onMount, getContext } from 'svelte';
import Button from '../Button/Button.svelte';
import { lineSpacing, paragraphSpacing } from '../../utility/localStorageStore';
import checkTextManipulatorAccessibility from './TextManipulator.accessibility';
import notProd from '../../utility/notProd';
/**
 * This property is required to ensure that each input element has a unqiue id to map the corresponding label to it correctly.
 * This is only required when using multiple instances of this component on a page.
 * @example
 * If you pass in 'cat', the id of the input-id input will be input-id-cat.
 * If you pass in '-cat', the id of the input-id input will be input-id--cat. Note the double dash!
 * @required
 */
export let id = '';
/**
 * Use this property to set the text on the submit button
 */
export let submitText = 'Submit';
/**
 * Use this property to set the text on the reset button
 */
export let resetText = 'Reset';
/**
 * Use this property to set the text on the cancel button
 */
export let cancelText = 'Cancel';
/**
 * If this prop is set to true, the inputs will updated automatically
 * and no 'submit' or 'cancel' button will be shown.
 */
export let autoUpdate = false;
/**
 * Use this property to add custom classes and stylings to the component.
 */
export let className = '';
/**
 * This property sets the text for the label of the line spacing input.
 */
export let lineSpacingLabelText = 'Choose the line-height for texts';
/**
 * This property sets the text for the label of the paragraph spacing input.
 */
export let paragraphSpacingLabelText = 'Choose the paragraph-spacing for texts';
const btnClass = 'text-manipulator-btn-3612';
let component;
const config = getContext('rockabilityConfig');
let isProduction;
let lineSpacingProp;
let paragraphSpacingProp;
let oldLineSpacingProp;
let oldParagraphSpacingProp;
onMount(() => {
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    isProduction = config && config.isProduction ? config.isProduction : null;
    initiateSpacings();
    notProd(() => checkTextManipulatorAccessibility(component, lineSpacingLabelText, paragraphSpacingLabelText), isProduction);
});
afterUpdate(() => {
    if (autoUpdate) {
        updateSpacings();
    }
});
function initiateSpacings() {
    try {
        lineSpacing.subscribe((value) => {
            lineSpacingProp = value;
        });
        paragraphSpacing.subscribe((value) => {
            paragraphSpacingProp = value;
        });
        oldLineSpacingProp = lineSpacingProp;
        oldParagraphSpacingProp = paragraphSpacingProp;
        updateStyles();
    }
    catch (error) {
        console.error(error);
    }
}
function handleOnCancel() {
    lineSpacingProp = oldLineSpacingProp;
    paragraphSpacingProp = oldParagraphSpacingProp;
}
function handleOnSubmit(e) {
    updateSpacings();
    e.preventDefault();
}
function updateSpacings() {
    lineSpacing.set(lineSpacingProp);
    paragraphSpacing.set(paragraphSpacingProp);
    oldLineSpacingProp = lineSpacingProp;
    oldParagraphSpacingProp = paragraphSpacingProp;
    updateStyles();
}
function updateStyles() {
    if ($lineSpacing && !isNaN(+$lineSpacing)) {
        document.documentElement.style.setProperty('--user-line-height', `${$lineSpacing}em`);
    }
    if ($paragraphSpacing && !isNaN(+$paragraphSpacing)) {
        document.documentElement.style.setProperty('--user-paragraph-spacing', `${$paragraphSpacing}em`);
    }
}
function resetSpacings() {
    document.documentElement.style.removeProperty('--user-line-height');
    document.documentElement.style.removeProperty('--user-paragraph-spacing');
    lineSpacingProp = '';
    paragraphSpacingProp = '';
    oldLineSpacingProp = lineSpacingProp;
    oldParagraphSpacingProp = paragraphSpacingProp;
    lineSpacing.set(lineSpacingProp);
    paragraphSpacing.set(paragraphSpacingProp);
}
</script>

<form bind:this={component} class="text-manipulator {className || ''}" on:submit={handleOnSubmit}>
	<div class="input-group">
		<div class="input-with-unit">
			<input
				type="number"
				min="1.0"
				step="0.1"
				id="line-spacing-{id}"
				name="line-spacing-{id}"
				bind:value={lineSpacingProp}
			/>
			<span class="unit-box">em</span>
		</div>
		<label for="line-spacing-{id}">{lineSpacingLabelText}</label>
	</div>

	<div class="input-group">
		<div class="input-with-unit">
			<input
				type="number"
				min="1.0"
				step="0.1"
				id="paragraph-spacing-{id}"
				name="paragraph-spacing-{id}"
				bind:value={paragraphSpacingProp}
			/>
			<span class="unit-box">em</span>
		</div>
		<label for="paragraph-spacing-{id}">{paragraphSpacingLabelText}</label>
	</div>

	<div class="btn-group">
		{#if oldLineSpacingProp != lineSpacingProp || oldParagraphSpacingProp != paragraphSpacingProp}
			<Button type="submit" className={btnClass}>{submitText}</Button>
			<Button type="cancel" className={btnClass} on:click={handleOnCancel}>{cancelText}</Button>
		{/if}

		<Button type="default" className={btnClass} on:click={resetSpacings}>{resetText}</Button>
	</div>
</form>

<style>.text-manipulator {
  display: flex;
  flex-direction: column;
  color: var(--font-color);
  background-color: var(--bg-color);
}

.btn-group {
  display: flex;
  flex-direction: row;
}

:global(.text-manipulator-btn-3612) {
  margin-right: 4px;
}

.input-group {
  display: flex;
  flex-direction: row;
  width: fit-content;
  align-items: center;
}
.input-group:not(:last-child) {
  margin-bottom: 8px;
}
.input-group input {
  margin: 0;
  width: 60px;
  height: 2.3em;
  color: var(--input-color);
  background: var(--input-bg);
  border: none;
  border-right: var(--input-border);
  border-color: var(--input-border-color);
  border-radius: var(--input-border-radius) 0 0 var(--input-border-radius);
  z-index: 1;
}
.input-group input:disabled {
  color: var(--input-disabled-color);
  background: var(--input-disabled-bg);
}
.input-group input:focus {
  outline: var(--outline);
  outline-color: var(--outline-color);
}
@media (pointer: coarse) {
  .input-group input input {
    min-height: 44px;
    min-width: 44px;
  }
}
.input-group .input-with-unit {
  border: var(--input-border);
  border-color: var(--input-border-color);
  border-radius: var(--input-border-radius);
  display: flex;
  flex-direction: row;
}
.input-group .unit-box {
  border: none;
  background-color: var(--unit-box-bg);
  padding: 4px;
  margin-left: 0;
  height: auto;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 var(--input-border-radius) var(--input-border-radius) 0;
}
.input-group label {
  margin-left: 10px;
}</style>
