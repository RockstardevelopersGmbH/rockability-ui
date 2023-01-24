<script>/**
 * An accessible multi select component.
 * Properties that have the same name as the attributes for the corresponding html input element should exhibit the same behaviour, as well.
 * For more information about the various properties for this component see: https://www.w3schools.com/tags/tag_input.asp
 *
 * Supported events: [rChange, rInput]
 * NOTE: These are custom events using the built-in event dispatcher of Svelte which can
 * be easily ready by calling the detail property of the emitted event (e.g. event.detail.options)
 *
 * rChange: { options: Object, activeIndex: number }
 * NOTE: activeIndex is the index of the options that was changed when the event was triggered.
 *
 * rInput: { options: Object, value: string }
 * NOTE: value refers to the typed in text in the input-field.
 *
 * Labels and errors can be passed in named slots called 'error' and 'label', respectively. The slots can be used if the
 * use needs more flexibility (e.g. adding icons).
 *  @component
 */
import { onMount, createEventDispatcher, getContext } from 'svelte';
import Label from '../Label/Label.svelte';
import checkMultiSelectAccessibility from './MultiSelect.accessible';
import notProd from '../../utility/notProd';
/**
 * The options are passed in as an array of options.
 *
 * The Option object must look like this:
 * Option { value: string, displayName: string, selected: boolean, disabled: boolean }
 * @required
 */
export let options = [];
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
 * Specifies that an input field must be filled out before submitting the form.
 */
export let required = false;
/**
 * Specifies that an input element should be disabled.
 */
export let disabled = false;
/**
 * Specifies whether the input element should have autocomplete enabled.
 */
export let autocomplete = 'on';
/**
 * Specifies the form the input element belongs to. This is only required if the component
 * is not a child of any form element.
 */
export let form = '';
/**
 * With this property one can set the maximum number of elements, that can be selected at once.
 * If maxSelectable is set to -1 then all options can be selected at once.
 */
export let maxSelectable = -1;
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
const prefix = 'combo';
const dispatch = createEventDispatcher();
let component;
let open = false;
let inputEl;
let listboxEl;
let filteredOptions = [];
let activeIndex = 0;
let ignoreBlur;
let activedescendant = '';
const config = getContext('rockabilityConfig');
let isProduction;
// make it easier for ourselves by putting some values in objects
// in TypeScript, these would be enums
const Keys = {
    Backspace: 'Backspace',
    Clear: 'Clear',
    Down: 'ArrowDown',
    End: 'End',
    Enter: 'Enter',
    Escape: 'Escape',
    Home: 'Home',
    Left: 'ArrowLeft',
    PageDown: 'PageDown',
    PageUp: 'PageUp',
    Right: 'ArrowRight',
    Space: ' ',
    Tab: 'Tab',
    Up: 'ArrowUp'
};
const MenuActions = {
    Close: 0,
    Select: 1,
    First: 2,
    Last: 3,
    Next: 4,
    Open: 5,
    Previous: 6,
    Space: 7,
    Type: 8
};
onMount(async () => {
    filteredOptions = options;
    if (maxSelectable === -1)
        maxSelectable = options.length;
    if (!labelText) {
        labelText = generateDefaultLabelText();
    }
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    isProduction = config && config.isProduction ? config.isProduction : null;
    notProd(() => checkMultiSelectAccessibility(component), isProduction);
    notProd(() => checkRequiredProps(), isProduction);
});
function generateDefaultLabelText() {
    return `Select for ${name}`;
}
function checkRequiredProps() {
    if (!name)
        console.error('A name for the MultiSelect component is required.', component);
    if (!id)
        console.error('An id for the MultiSelect component is required.', component);
}
function handleOnInput() {
    const curValue = inputEl.value;
    filterOptions(curValue);
    // if active option is not in filtered options, set it to first filtered option
    if (filteredOptions.indexOf(options[activeIndex]) < 0) {
        const firstFilteredIndex = options.indexOf(filteredOptions[0]);
        onOptionChange(firstFilteredIndex);
    }
    const menuState = filteredOptions.length > 0;
    if (open !== menuState) {
        updateMenuState(menuState, false);
    }
    dispatch('rInput', {
        options: options,
        value: curValue
    });
}
function handleOnBlur() {
    if (ignoreBlur) {
        ignoreBlur = false;
        return;
    }
    if (open) {
        // If the focus moves away from the <input> element, close the menu.
        updateMenuState(false, false);
    }
}
function handleOnInputKeyDown(event) {
    const { key } = event;
    const max = filteredOptions.length - 1;
    const action = getActionFromKey(key, open);
    switch (action) {
        case MenuActions.Next:
        case MenuActions.Last:
        case MenuActions.First:
        case MenuActions.Previous: {
            event.preventDefault();
            const nextFilteredIndex = getUpdatedIndex(activeIndex, max, action);
            return onOptionChange(nextFilteredIndex);
        }
        case MenuActions.Select:
            event.preventDefault();
            return updateOption(activeIndex);
        case MenuActions.Close:
            event.preventDefault();
            return updateMenuState(false);
        case MenuActions.Open:
            event.preventDefault();
            return updateMenuState(true, false);
    }
}
function updateMenuState(openState, callFocus = true) {
    open = openState;
    callFocus && inputEl.focus();
}
function filterOptions(value) {
    if (!value) {
        // If no value is present, show all options
        filteredOptions = options;
        return;
    }
    // Filter for options based on the given value
    filteredOptions = options.filter((option) => {
        const matches = option.displayName.toLowerCase().indexOf(value.toLowerCase()) === 0;
        return matches;
    });
}
function onOptionClick(index) {
    if (filteredOptions[index].disabled)
        return;
    onOptionChange(index);
    updateOption(index);
    inputEl.focus();
}
function onOptionMouseDown() {
    ignoreBlur = true;
}
function removeOption(index) {
    // Get the correct index to operate on the correct element in the options-array
    const unfilteredIndex = options.findIndex((x) => x.value == filteredOptions[index].value);
    if (!filteredOptions[index].disabled)
        options[unfilteredIndex].selected = false;
    filterOptions('');
    filterOptions(inputEl.value);
    dispatch('rChange', {
        options: options,
        activeIndex: unfilteredIndex
    });
}
function selectOption(index) {
    // Limit the number of selectable options
    if (options.filter((x) => x.selected).length >= maxSelectable)
        return;
    activeIndex = index;
    // Get the correct index to operate on the correct element in the options-array
    const unfilteredIndex = options.findIndex((x) => x.value == filteredOptions[index].value);
    if (!filteredOptions[index].disabled)
        options[unfilteredIndex].selected = true;
    filterOptions('');
    filterOptions(inputEl.value);
    dispatch('rChange', {
        options: options,
        activeIndex: unfilteredIndex
    });
}
function onOptionChange(index) {
    activeIndex = index;
    activedescendant = `${id}-${index}`;
    if (open && isScrollable(listboxEl)) {
        maintainScrollVisibility(options[index], listboxEl);
    }
}
function updateOption(index) {
    // If the user filters options, it doesn't focus the first element automatically.
    // So if he types in a filter and immeadiatly presses the key to select the first element,
    // it will throw an error without this line.
    if (!filteredOptions[index])
        index = 0;
    const isSelected = filteredOptions[index].selected;
    if (isSelected) {
        removeOption(index);
    }
    else {
        selectOption(index);
    }
}
// check if an element is currently scrollable
function isScrollable(element) {
    return element && element.clientHeight < element.scrollHeight;
}
// ensure given child element is within the parent's visible scroll area
function maintainScrollVisibility(activeElement, scrollParent) {
    activeElement = getHTMLElement(activeIndex);
    if (!activeElement)
        return;
    const { offsetHeight, offsetTop } = activeElement;
    const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;
    const isAbove = offsetTop < scrollTop;
    const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;
    if (isAbove) {
        scrollParent.scrollTo(0, offsetTop);
    }
    else if (isBelow) {
        scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
    }
}
// return combobox action from key press
function getActionFromKey(key, menuOpen) {
    // handle opening when closed
    if (!menuOpen && key === Keys.Down) {
        return MenuActions.Open;
    }
    // handle keys when open
    if (key === Keys.Down) {
        return MenuActions.Next;
    }
    else if (key === Keys.Up) {
        return MenuActions.Previous;
    }
    else if (key === Keys.Home) {
        return MenuActions.First;
    }
    else if (key === Keys.End) {
        return MenuActions.Last;
    }
    else if (key === Keys.Escape) {
        return MenuActions.Close;
    }
    else if (key === Keys.Enter) {
        return open ? MenuActions.Select : MenuActions.Open;
    }
}
// get updated option index
function getUpdatedIndex(current, max, action) {
    switch (action) {
        case MenuActions.First:
            return 0;
        case MenuActions.Last:
            return max;
        case MenuActions.Previous:
            return current - 1 < 0 ? max : current - 1;
        case MenuActions.Next:
            return current + 1 > max ? 0 : current + 1;
        default:
            return current;
    }
}
function getHTMLElement(index) {
    const optionElements = listboxEl.children;
    for (let option of optionElements) {
        if (option.getAttribute('value') == options[index].value)
            return option;
    }
    return null;
}
</script>

<div bind:this={component} class="multi-select {className || ''}">
	<!-- hidden select to be able to handle the user inputs in forms with the default behaviour -->
	<select
		style="display: none;"
		aria-hidden="true"
		multiple
		form={form || null}
		required={required || null}
		disabled={disabled || null}
		{name}
	>
		{#each options as option (option.value)}
			<option
				value={option.value}
				disabled={option.disabled || null}
				selected={option.selected || null}>{option.displayName}</option
			>
		{/each}
	</select>

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

	<span id={`combo-remove-${id}`} style="display: none">remove</span>
	<!-- used as descriptive text for option buttons; if used within the button text itself, it ends up being read with the input name -->
	<ul class="selected-options" id="combo-selected-{id}">
		{#each options as option, i}
			{#if option.selected}
				<li>
					<button
						disabled={disabled || null}
						type="button"
						class="remove-option"
						id={`${id}-remove-${i}`}
						on:click={() => removeOption(i)}>{option.displayName}</button
					>
				</li>
			{/if}
		{/each}
	</ul>
	<div class="combo js-multi-buttons js-csv">
		<div
			role="combobox"
			aria-haspopup="listbox"
			aria-expanded={open}
			aria-owns={`listbox-${id}`}
			class="input-wrapper"
		>
			<input
				disabled={disabled ? true : null}
				bind:this={inputEl}
				aria-activedescendant={activedescendant}
				aria-autocomplete={autocomplete !== 'off' ? 'both' : 'none'}
				aria-labelledby={showLabel ? `${prefix}-label-${id} combo-selected-${id}` : null}
				aria-label={!showLabel ? labelText : null}
				id={`combo-${id}`}
				class="combo-input {open ? 'open' : ''} {showError ? 'error' : ''}"
				type="text"
				autocomplete={autocomplete || null}
				on:input={handleOnInput}
				on:keydown={handleOnInputKeyDown}
				on:blur={handleOnBlur}
				on:click={() => updateMenuState(true)}
			/>
		</div>
		<div
			bind:this={listboxEl}
			class="combo-menu {open ? 'open' : ''}"
			role="listbox"
			aria-multiselectable="true"
			id={`listbox-${id}`}
		>
			{#each filteredOptions as option, i}
				<div
					class="combo-option {option.selected ? 'option-selected' : ''} {i === activeIndex
						? 'option-current'
						: ''} {option.disabled ? 'option-disabled' : ''}"
					role="option"
					value={option.value}
					aria-selected={option.selected}
					on:click={() => onOptionClick(i)}
					on:mousedown={onOptionMouseDown}
				>
					{option.displayName}
				</div>
			{/each}
		</div>
	</div>

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

<style>.multi-select {
  color: var(--font-color);
  background-color: var(--bg-color);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.combo {
  display: block;
  position: relative;
}

.combo::after {
  border-bottom: 2px solid var(--input-color);
  border-right: 2px solid var(--input-color);
  content: "";
  display: block;
  height: 12px;
  pointer-events: none;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translate(0, -65%) rotate(45deg);
  width: 12px;
}

input {
  color: var(--input-color);
  background: var(--input-bg);
  margin: 5px 0 0 0;
  height: 2.3em;
  border: var(--input-border);
  border-color: var(--input-border-color);
  border-radius: var(--input-border-radius);
  width: 100%;
}
input::placeholder {
  font-size: 1.1em;
  padding-left: 4px;
}
input:disabled {
  color: var(--input-disabled-color);
  background: var(--input-disabled-bg);
}
input:focus {
  outline: var(--outline);
  outline-color: var(--outline-color);
}
input.open {
  border-radius: var(--input-border-radius) var(--input-border-radius) 0 0;
}

@media (pointer: coarse) {
  input {
    min-height: 44px;
    min-width: 44px;
  }
}
.errorMessage {
  color: var(--input-error-color);
  margin: var(--input-error-margin);
  font-size: var(--input-error-font-size);
}

.error {
  background: var(--input-error-highlight);
}

.combo-menu {
  background: var(--input-bg);
  color: var(--input-color);
  border: var(--input-border);
  border-color: var(--input-border-color);
  border-radius: 0 0 var(--input-border-radius) var(--input-border-radius);
  display: none;
  max-height: 300px;
  overflow-y: auto;
  left: 0;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 100;
  margin-top: 0;
  outline: var(--outline);
  outline-color: var(--outline-color);
}

.open {
  display: block;
}

.combo-option {
  padding: 8px 10px;
}
.combo-option:not(:last-child) {
  border-bottom: var(--input-border);
  border-color: var(--input-border-color);
}

.combo-option.option-current,
.combo-option:hover {
  color: var(--input-color-hover);
  background: var(--input-bg-hover);
}

.combo-option.option-selected {
  padding-right: 30px;
  position: relative;
}

.combo-option.option-selected::after {
  border-bottom: 2px solid var(--input-color);
  border-right: 2px solid var(--input-color);
  content: "";
  height: 16px;
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translate(0, -50%) rotate(45deg);
  width: 8px;
}

.option-disabled {
  color: var(--input-disabled-color);
  background: var(--input-disabled-bg);
}
.option-disabled:hover {
  color: var(--input-disabled-color);
  background: var(--input-disabled-bg);
}

.combo-option.option-current.option-disabled {
  color: var(--input-disabled-color);
  background: var(--input-disabled-bg);
}

/* multiselect list of selected options */
.selected-options {
  list-style-type: none;
  margin: 4px 0 -6px 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}

.remove-option {
  background: var(--primary-bg);
  border: var(--primary-border);
  border-color: var(--primary-border-color);
  border-radius: 3px;
  color: var(--primary-color);
  font-size: 0.75em;
  margin-bottom: 6px;
  margin-right: 6px;
  padding: 0.25em 1.75em 0.25em 0.25em;
  position: relative;
  cursor: pointer;
}
.remove-option:disabled {
  background: var(--input-disabled-bg);
  color: var(--input-disabled-color);
}
.remove-option:hover {
  color: var(--primary-color-hover);
  background-color: var(--primary-bg-hove);
}
.remove-option:hover::after, .remove-option:hover::before {
  border-color: var(--primary-color-hover);
}

.remove-option:focus {
  outline: var(--outline);
  outline-color: var(--outline-color);
}

.remove-option::before,
.remove-option::after {
  border-right: 2px solid var(--primary-color);
  content: "";
  height: 1em;
  right: 0.75em;
  position: absolute;
  top: 50%;
  width: 0;
}

.remove-option::before {
  transform: translate(0, -50%) rotate(45deg);
}

.remove-option::after {
  transform: translate(0, -50%) rotate(-45deg);
}</style>
