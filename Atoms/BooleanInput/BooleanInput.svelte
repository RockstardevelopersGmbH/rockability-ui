<script>/**
 * An accessible boolean type input component. The component supports the types [radio, checkbox]
 * Properties that have the same name as the attributes for the html input element should exhibit the same behaviour, as well.
 * For more information about the various properties for this component see: https://www.w3schools.com/tags/tag_input.asp
 *
 * Supported events: [on:change, on:input]
 *
 * Labels and errors can be passed in named slots called 'error' and 'label', respectively. The slots can be used if the
 * use needs more flexibility (e.g. adding icons).
 *  @component
 */
import { onMount, getContext } from 'svelte';
import checkBooleanInputAccessibility from './BooleanInput.accessibility';
import Label from '../Label/Label.svelte';
import notProd from '../../utility/notProd';
/**
 * A unique identifier used as a post fix for the html elements used in this component.
 * @required
 */
export let id = '';
/**
 * Specifies the name of an input element. If no labelText is assigned, the name property
 * will be used to generate a label text instead.
 * @required
 */
export let name = '';
/**
 * The value of the input element.
 */
export let value = '';
/**
 * Use this property to add custom classes and stylings to the component.
 */
export let className = '';
/**
 * Define the type of the input element. Valid types are:
 * radio and checkbox
 */
export let type = 'radio' || 'checkbox';
/**
 * Specifies that an input field must be filled out before submitting the form.
 */
export let required = false;
/**
 * Specifies that an input element should be disabled.
 */
export let disabled = false;
/**
 * Specifies that an input field is read-only.
 */
export let readonly = false;
/**
 * Specifies the form the input element belongs to. This is only required if the TextInput component
 * is not a child of any form element.
 */
export let form = '';
/**
 * Specifies whether the control is checked or not.
 */
export let checked = false;
/**
 * Specify the text for the label. The label will be automatically generated for the input field.
 * If this property won't be specified, a default name will be generated based on the input type
 * and the given name property.
 */
export let labelText = '';
/**
 * Use this property to show or hide the label of an input element. If showLabel is set to false,
 * the corresponding input element will have an aria-label element with the labelText instead.
 */
export let showLabel = true;
/**
 * Use this property to provide an error message for this input field in case any validation failed.
 */
export let errorMessage = '';
/**
 * Use this property to show or hide the error of an input element.
 */
export let showError = false;
let component;
const validTypes = ['radio', 'checkbox'];
const config = getContext('rockabilityConfig');
let isProduction;
const prefix = 'boolean-input';
onMount(async () => {
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    isProduction = config && config.isProduction ? config.isProduction : null;
    if (!labelText) {
        labelText = generateDefaultLabelText();
    }
    notProd(() => checkForValidType(), isProduction);
    notProd(() => checkRequiredProps(), isProduction);
    notProd(() => checkBooleanInputAccessibility(component, showLabel), isProduction);
});
function generateDefaultLabelText() {
    let inputType;
    switch (type) {
        case 'checkbox':
            inputType = 'Checkbox';
            break;
        case 'radio':
            inputType = 'Radio input';
            break;
        default:
            inputType = 'Control';
            break;
    }
    return `${inputType} for ${name}`;
}
function checkForValidType() {
    if (validTypes.includes(type))
        return;
    console.error(`The type '${type}' is not valid for BooleanInput. Valid types are [${validTypes}]`, component);
}
function checkRequiredProps() {
    if (!name)
        console.error('A name for the BooleanInput component is required.', component);
    if (!id)
        console.error('An id for the BooleanInput component is required.', component);
}
</script>

<div bind:this={component} class="input-group {className || ''}">
	<!-- Render input element -->
	<input
		class={showError ? 'error' : ''}
		required={required || null}
		disabled={disabled || null}
		{type}
		value={value || null}
		readonly={readonly || null}
		name={name || null}
		id={`${prefix}-${id}`}
		form={form || null}
		checked={checked || null}
		aria-labelledby={showLabel ? `${prefix}-label-${id}` : null}
		aria-label={!showLabel ? labelText : null}
		on:change
		on:input
	/>

	<!-- Render label in case positionLabelAfter equals true -->
	{#if $$slots.label}
		<Label {showLabel} {labelText} {id} {prefix}>
			<svelte:fragment slot="label">
				<slot name="label" />
			</svelte:fragment>
		</Label>
	{:else}
		<Label {showLabel} {labelText} {id} {prefix} />
	{/if}

	<!-- Render input errors -->
	{#if $$slots.error && showError}
		<div class="errorMessage" role="alert">
			<slot name="error" />
		</div>
	{:else if errorMessage && showError}
		<div class="errorMessage" role="alert">
			{errorMessage}
		</div>
	{/if}
</div>

<style>.input-group {
  color: var(--font-color);
  background-color: var(--bg-color);
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  align-items: center;
  column-gap: 10px;
}

.errorMessage {
  color: var(--input-error-color);
  margin: var(--input-error-margin);
  font-size: var(--input-error-font-size);
  grid-row: 2/2;
  grid-column: 2/2;
}

.error {
  background-color: var(--input-error-highlight);
}

input {
  /* Add if not using autoprefixer */
  -webkit-appearance: none;
  /* Remove most all native input styles */
  appearance: none;
  /* For iOS < 15 */
  background-color: var(--boolean-bg);
  /* Not removed via appearance */
  margin: 5px 0;
  width: 1.2em;
  height: 1.2em;
  display: grid;
  place-content: center;
}
input:focus {
  outline: var(--outline);
  outline-color: var(--outline-color);
  outline-offset: max(2px, 0.15em);
}
input:disabled {
  background-color: var(--input-disabled-bg);
}

input[type=radio] {
  border: var(--input-border);
  border-color: var(--input-border-color);
  border-radius: 50%;
}
input[type=radio]::before {
  content: "";
  width: 0.5em;
  height: 0.5em;
  border-radius: 50%;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--boolean-selected-color);
  background-color: var(--boolean-selected-color);
}
input[type=radio]:checked {
  border-color: var(--boolean-selected-color);
}
input[type=radio]:checked::before {
  transform: scale(1);
}

input[type=checkbox] {
  border: var(--input-border);
  border-color: var(--input-border-color);
  border-radius: var(--input-border-radius);
}
input[type=checkbox]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  transform: scale(0);
  transform-origin: bottom left;
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--boolean-selected-color);
  background-color: var(--boolean-selected-color);
}
input[type=checkbox]:checked {
  border-color: var(--boolean-selected-color);
}
input[type=checkbox]:checked::before {
  transform: scale(1);
}</style>
