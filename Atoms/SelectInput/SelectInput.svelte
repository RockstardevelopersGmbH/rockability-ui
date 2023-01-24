<script>/**
 * An accessible select component.
 * Properties that have the same name as the attributes for the corresponding html input element should exhibit the same behaviour, as well.
 * For more information about the various properties for this component see: https://www.w3schools.com/tags/tag_input.asp
 *
 * Supported events: [on:change, on:input]
 *
 * Labels and errors can be passed in named slots called 'error' and 'label', respectively. The slots can be used if the
 * use needs more flexibility (e.g. adding icons).
 *  @component
 */
import { onMount, getContext } from 'svelte';
import Label from '../Label/Label.svelte';
import notProd from '../../utility/notProd';
import checkSelectInputAccessibility from './SelectInput.accessibility';
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
 * Use this property to add custom classes and stylings to the component.
 */
export let className = '';
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
 * Specifies the form the input element belongs to. This is only required if the component
 * is not a child of any form element.
 */
export let form = '';
/**
 * This attribute represents the number of rows in the list that should be visible at one time.
 */
export let size = 0;
/**
 * Specifies that a user can select more than one option.
 * But there is also a MultiSelect component which is more accessible than using this property.
 */
export let multiple = false;
/**
 * The options are passed in as an array of options.
 *
 * The Option object must look like this:
 * Option { value: string, displayName: string, selected: boolean, disabled: boolean }
 */
export let options = [];
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
const prefix = 'select-input';
onMount(async () => {
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    isProduction = config && config.isProduction ? config.isProduction : null;
    if (!labelText) {
        labelText = generateDefaultLabelText();
    }
    notProd(() => checkRequiredProps(), isProduction);
    notProd(() => checkSelectInputAccessibility(component, showLabel, autocomplete), isProduction);
});
function generateDefaultLabelText() {
    return `Select for ${name}`;
}
function checkRequiredProps() {
    if (!name)
        console.error('A name for the SelectInput component is required.', component);
    if (!id)
        console.error('An id for the SelectInput component is required.', component);
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
	<select
		class={showError ? 'error' : ''}
		required={required || null}
		disabled={disabled || null}
		autocomplete={autocomplete || null}
		{name}
		id={`${prefix}-${id}`}
		form={form || null}
		multiple={multiple || null}
		size={size || null}
		aria-labelledby={showLabel ? `${prefix}-label-${id}` : null}
		aria-label={!showLabel ? labelText : null}
		on:change
		on:input
	>
		{#each options as option (option.value)}
			<option
				value={option.value}
				disabled={option.disabled || null}
				selected={option.selected || null}>{option.displayName}</option
			>
		{/each}
	</select>

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

select {
  height: 2.3em;
  color: var(--input-color);
  background: var(--input-bg);
  border: var(--input-border);
  border-color: var(--input-border-color);
  border-radius: var(--input-border-radius);
}
select:focus {
  outline: var(--outline);
  outline-color: var(--outline-color);
}
select:disabled {
  color: var(--input-disabled-color);
  background: var(--input-disabled-bg);
}

option {
  color: var(--input-color);
  background: var(--input-bg);
  border: var(--input-border);
  border-color: var(--input-border-color);
  border-radius: var(--input-border-radius);
}

@media (pointer: coarse) {
  select {
    min-height: 44px;
    min-width: 44px;
  }

  option {
    min-height: 44px;
    min-width: 44px;
  }
}</style>
