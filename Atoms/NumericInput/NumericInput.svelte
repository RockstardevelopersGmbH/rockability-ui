<script>/**
 * An accessible numeric input component.
 * Properties that have the same name as the attributes for the corresponding html input element should exhibit the same behaviour, as well.
 * For more information about the various properties for this component see: https://www.w3schools.com/tags/tag_input.asp
 *
 * Supported events: [on:blur, on:change, on:focus, on:input, on:select]
 *
 * Labels and errors can be passed in named slots called 'error' and 'label', respectively. The slots can be used if the
 * use needs more flexibility (e.g. adding icons).
 *  @component
 */
import { onMount, getContext } from 'svelte';
import Label from '../Label/Label.svelte';
import checkNumbericInputAccessibility from './NumericInput.accessibility';
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
 * The inputmode gives a hint to the browser for which keayboard to display.
 */
export let inputmode = 'numeric';
/**
 * Specifies whether the input element should have autocomplete enabled.
 */
export let autocomplete = 'on';
/**
 * Specifies that an input field must be filled out before submitting the form.
 */
export let required = false;
/**
 * Specifies that an input element should be disabled.
 */
export let disabled = false;
/**
 * Specifies a short hint that describes the expected value of an input element.
 */
export let placeholder = '';
/**
 * Specifies that an input field is read-only.
 */
export let readonly = false;
/**
 * Specifies the minimum value.
 */
export let min = null;
/**
 * Specifies the maximum value.
 */
export let max = null;
/**
 * Specifies the icremental values that are valid
 */
export let step = null;
/**
 * Specifies the form the input element belongs to. This is only required if the component
 * is not a child of any form element.
 */
export let form = '';
/**
 * Refers to a datalist element that contains pre-defined options for an input element.
 * This property can be useful for input suggestions. Note that you only have to pass in a
 * string array. The dataset elements will be automatically generated by this component using
 * the value in the given array.
 */
export let list = [];
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
 * Use this property to specify if the label should be rendered before the input element or after the input element.
 * This property might come in handy for proper positioning of the label and input fields.
 * If positionLabelAfter equals true, first the input element is rendered, then the label element.
 */
export let positionLabelAfter = false;
/**
 * Use this property to provide an error message for this input field in case any validation failed.
 */
export let errorMessage = '';
/**
 * Use this property to show or hide the error of an input element.
 */
export let showError = false;
let component;
const config = getContext('rockabilityConfig');
let isProduction;
const prefix = 'numeric-input';
onMount(async () => {
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    isProduction = config && config.isProduction ? config.isProduction : null;
    if (!labelText) {
        labelText = generateDefaultLabelText();
    }
    notProd(() => checkRequiredProps(), isProduction);
    notProd(() => checkNumbericInputAccessibility(component, showLabel, autocomplete), isProduction);
});
function generateDefaultLabelText() {
    return `Number input for ${name}`;
}
function checkRequiredProps() {
    if (!name)
        console.error('A name for the NumericInput component is required.', component);
    if (!id)
        console.error('An id for the NumericInput component is required.', component);
}
</script>

<div bind:this={component} class="input-group {className || ''}">
	<!-- Render label in case positionLabelAfter equals false -->
	{#if !positionLabelAfter}
		{#if $$slots.label}
			<Label {showLabel} {labelText} {id} {prefix}>
				<svelte:fragment slot="label">
					<slot name="label" />
				</svelte:fragment>
			</Label>
		{:else}
			<Label {showLabel} {labelText} {id} {prefix} />
		{/if}
	{/if}

	<!-- Render input element -->
	<input
		type="number"
		inputmode={inputmode || null}
		class={showError ? 'error' : ''}
		required={required || null}
		disabled={disabled || null}
		autocomplete={autocomplete || null}
		value={value || null}
		placeholder={placeholder || null}
		readonly={readonly || null}
		name={name || null}
		min={min == null ? null : min}
		max={max == null ? null : max}
		step={step == null ? null : step}
		id={`${prefix}-${id}`}
		form={form || null}
		list={list && list.length > 0 ? `${id}-dataset` : null}
		aria-labelledby={showLabel ? `${prefix}-label-${id}` : null}
		aria-label={!showLabel ? labelText : null}
		on:change
		on:blur
		on:focus
		on:input
		on:select
	/>

	<!-- Render label in case positionLabelAfter equals true -->
	{#if positionLabelAfter}
		{#if $$slots.label}
			<Label {showLabel} {labelText} {id} {prefix}>
				<svelte:fragment slot="label">
					<slot name="label" />
				</svelte:fragment>
			</Label>
		{:else}
			<Label {showLabel} {labelText} {id} {prefix} />
		{/if}
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

	<!-- Render the dataset element in case the list property was set -->
	{#if list && list.length > 0}
		<datalist id="{id}-dataset">
			{#each list as option}
				<option value={option} />
			{/each}
		</datalist>
	{/if}
</div>

<style>.input-group {
  display: flex;
  flex-direction: column;
  color: var(--font-color);
  background-color: var(--bg-color);
}

.errorMessage {
  color: var(--input-error-color);
  margin: var(--input-error-margin);
  font-size: var(--input-error-font-size);
}

.error {
  background-color: var(--input-error-highlight);
}

input {
  color: var(--input-color);
  background: var(--input-bg);
  border: var(--input-border);
  border-color: var(--input-border-color);
  border-radius: var(--input-border-radius);
  margin: 5px 0;
  height: 2em;
}
input::placeholder {
  font-size: 1.1em;
  padding-left: 4px;
}
input:focus {
  outline: var(--outline);
  outline-color: var(--outline-color);
}
input:disabled {
  color: var(--input-disabled-color);
  background: var(--input-disabled-bg);
}

@media (pointer: coarse) {
  input {
    min-height: 44px;
    min-width: 44px;
  }
}</style>
