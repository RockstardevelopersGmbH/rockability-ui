<script>/**
 * An accessible textarea component.
 * Properties that have the same name as the attributes for the html \<textarea\> element should exhibit the same behaviour, as well.
 *
 * Supported events: [on:input; on:blur; on:focus; on:change; on:select; on:selectionchange]
 *
 * Labels and errors can be passed in named slots called 'error' and 'label', respectively. The slots can be used if the
 * use needs more flexibility (e.g. adding icons).
 *  @component
 */
import { onMount, getContext } from 'svelte';
import notProd from '../../utility/notProd';
import Label from '../Label/Label.svelte';
import checkTextAreaAccessibility from './TextArea.accessibility';
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
 * The value of the \<textarea\> element.
 */
export let value = '';
/**
 * Specifies that an \<textarea\> field must be filled out before submitting the form.
 */
export let required = false;
/**
 * Specifies that an \<textarea\> element should be disabled.
 */
export let disabled = false;
/**
 * Specifies whether the \<textarea\> element should have autocomplete enabled.
 */
export let autocomplete = 'on';
/**
 * Specifies the form the input element belongs to. This is only required if the component
 * is not a child of any form element.
 */
export let form = '';
/**
 * The visible width of the text control, in average character widths.
 */
export let cols;
/**
 * The number of visible text lines for the control.
 */
export let rows;
/**
 * The maximum number of characters (UTF-16 code units) that the user can enter.
 * If this value isn't specified, the user can enter an unlimited number of characters.
 */
export let maxlength;
/**
 * The minimum number of characters (UTF-16 code units) required that the user should enter.
 */
export let minlength;
/**
 * This Boolean attribute indicates that the user cannot modify the value of the control.
 */
export let readonly;
/**
 * A hint to the user of what can be entered in the control.
 */
export let placeholder;
/**
 * Specifies whether the \<textarea\> is subject to spell checking by the underlying browser/OS.
 */
export let spellcheck = true;
/**
 * Indicates how the control wraps text. Possible values are [hard, soft, off]
 */
export let wrap = 'hard' || 'soft' || 'off';
/**
 * Use this property to set the value of the css resize property on the
 * \<textarea\> element.
 */
export let resize = 'vertical';
/**
 * Specify the text for the label. The label will be automatically generated for the \<textarea\> field.
 * If this property won't be specified, a default name will be generated based the given name property.
 */
export let labelText = '';
/**
 * Use this property to show or hide the label of an input element. If showLabel is set to false,
 * the corresponding input element will have an aria-label element with the labelText instead.
 */
export let showLabel = true;
/**
 * Use this property to specify if the label should be rendered before the input element or after the \<textarea\> element.
 * This property might come in handy for proper positioning of the label and \<textarea\> field.
 * If positionLabelAfter equals true, first the \<textarea\> element is rendered, then the label element.
 */
export let positionLabelAfter = false;
/**
 * Use this property to provide an error message for this \<textarea\> field in case any validation failed.
 */
export let errorMessage = '';
/**
 * Use this property to show or hide the error of an \<textarea\> element.
 */
export let showError = false;
let component;
const config = getContext('rockabilityConfig');
let isProduction;
let prefix = 'textarea';
onMount(async () => {
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    isProduction = config && config.isProduction ? config.isProduction : null;
    if (!labelText)
        labelText = generateDefaultLabelText();
    notProd(() => checkRequiredProps(), isProduction);
    notProd(() => checkTextAreaAccessibility(component, showLabel, autocomplete), isProduction);
});
function generateDefaultLabelText() {
    return `Textarea for ${name}`;
}
function checkRequiredProps() {
    if (!name)
        console.error('A name for the TextArea component is required.', component);
    if (!id)
        console.error('An id for the TextArea component is required.', component);
}
</script>

<div class="textarea {className || ''}" bind:this={component}>
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

	<textarea
		class={showError ? 'error' : ''}
		required={required || null}
		disabled={disabled || null}
		autocomplete={autocomplete || null}
		placeholder={placeholder || null}
		readonly={readonly || null}
		name={name || null}
		minlength={minlength || null}
		maxlength={maxlength || null}
		id={`${prefix}-${id}`}
		form={form || null}
		wrap={wrap || null}
		spellcheck={spellcheck || null}
		cols={cols || null}
		rows={rows || null}
		aria-labelledby={showLabel ? `${prefix}-label-${id}` : null}
		aria-label={!showLabel ? labelText : null}
		style={resize ? `resize: ${resize};` : null}
		on:input
		on:blur
		on:focus
		on:change
		on:select
		on:selectionchange>{value}</textarea
	>

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

<style>.textarea {
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

textarea {
  margin: 5px 0;
  border: var(--input-border);
  border-color: var(--input-border-color);
  border-radius: var(--input-border-radius);
  color: var(--input-color);
  background: var(--input-bg);
  padding: 10px;
  height: 15em;
}
textarea::placeholder {
  font-size: 1.1em;
  padding-left: 4px;
}
textarea:disabled {
  color: var(--input-disabled-color);
  background: var(--input-disabled-bg);
}
textarea:focus {
  outline: var(--outline);
  outline-color: var(--outline-color);
}

@media (pointer: coarse) {
  textarea {
    min-height: 44px;
    min-width: 44px;
  }
}</style>
