<script>/**
 * An accessible custom select component.
 * Properties that have the same name as the attributes for the corresponding html input element should exhibit the same behaviour, as well.
 * For more information about the various properties for this component see: https://www.w3schools.com/tags/tag_input.asp
 *
 * Supported events: [rChange]
 * NOTE: These are custom events using the built-in event dispatcher of Svelte which can
 * be easily ready by calling the detail property of the emitted event (e.g. event.detail.options)
 *
 * rChange: { selected: Object }
 *
 *
 * Labels and errors can be passed in named slots called 'error' and 'label', respectively. The slots can be used if the
 * use needs more flexibility (e.g. adding icons).
 *  @component
 */
import { onMount, createEventDispatcher, getContext } from 'svelte';
import Label from '../Label/Label.svelte';
import checkCustomSelectAccessibility from './CustomSelectInput.accessible';
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
 * Specifies a short hint that describes the expected value of an input element.
 */
export let placeholder = '';
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
/**
 * Use this property to set the initial value to an empty string.
 */
export let initEmpty = true;
const prefix = 'combo';
const dispatch = createEventDispatcher();
let component;
let open = false;
let inputEl;
let listboxEl;
let activeIndex = 0;
let ignoreBlur;
let activedescendant = '';
const config = getContext('rockabilityConfig');
let isProduction;
let selectedDisplayName = '';
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
    if (!labelText) {
        labelText = generateDefaultLabelText();
    }
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    isProduction = config && config.isProduction ? config.isProduction : null;
    initValue();
    notProd(() => checkCustomSelectAccessibility(component), isProduction);
    notProd(() => checkRequiredProps(), isProduction);
});
// Updates the value at the initialization
function initValue() {
    options.forEach((option) => {
        // Select the last selected element.
        // This is the default behavior of HTMLSelectElements
        if (option.selected) {
            selectedDisplayName = option.displayName;
        }
        // If initEmpty is set to true, the initialized value should be an empty value.
        if (selectedDisplayName == '' && initEmpty) {
            selectedDisplayName = '';
        }
        // Otherwise select the first element.
        // This is the default behavior of HTMLSelectElements
        else if (selectedDisplayName == '' && !initEmpty) {
            selectedDisplayName = options[0].displayName;
        }
    });
}
function generateDefaultLabelText() {
    return `Select for ${name}`;
}
function checkRequiredProps() {
    if (!name)
        console.error('A name for the MultiSelect component is required.', component);
    if (!id)
        console.error('An id for the MultiSelect component is required.', component);
}
function handleOnBlur() {
    if (disabled)
        return;
    if (ignoreBlur) {
        ignoreBlur = false;
        return;
    }
    if (open) {
        updateMenuState(false, false);
    }
}
function handleOnInputKeyDown(event) {
    if (disabled)
        return;
    const { key } = event;
    const max = options.length - 1;
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
            updateMenuState(false);
            return selectOption(activeIndex);
        case MenuActions.Close:
            event.preventDefault();
            return updateMenuState(false);
        case MenuActions.Open:
            event.preventDefault();
            return updateMenuState(true, false);
        default:
            activeIndex = autocompleteOption(key);
            return onOptionChange(activeIndex);
    }
}
function autocompleteOption(key) {
    // 1) filter the options
    const filteredOptions = options.filter((x) => x.displayName.toLowerCase().startsWith(key.toLowerCase()));
    if (filteredOptions.length <= 0)
        return activeIndex;
    let nextActiveIndex;
    let foundResult = false;
    // 2) check if there is an element after the activeIndex that statisfies the condition
    filteredOptions.forEach((option) => {
        const nextIndex = options.findIndex((x) => x.value == option.value);
        if (nextIndex > activeIndex && !foundResult) {
            nextActiveIndex = nextIndex;
            foundResult = true;
        }
    });
    // 3) If there was no element found, take the first of the filtered list
    if (!nextActiveIndex)
        nextActiveIndex = options.findIndex((x) => x.value == filteredOptions[0].value);
    if (nextActiveIndex >= 0)
        return nextActiveIndex;
    else
        return activeIndex;
}
function updateMenuState(openState, callFocus = true) {
    if (disabled)
        return;
    open = openState;
    callFocus && inputEl.focus();
}
function onOptionClick(index) {
    if (options[index].disabled)
        return;
    onOptionChange(index);
    selectOption(index);
    updateMenuState(false);
}
function onOptionMouseDown() {
    ignoreBlur = true;
}
function selectOption(index) {
    if (options[index].disabled)
        return;
    for (let i = 0; i < options.length; i++) {
        options[i].selected = false;
    }
    options[index].selected = true;
    selectedDisplayName = options[index].displayName;
    dispatch('rChange', {
        selected: options[index]
    });
}
function onOptionChange(index) {
    activeIndex = index;
    activedescendant = `${id}-${index}`;
    if (open && isScrollable(listboxEl)) {
        maintainScrollVisibility(options[index], listboxEl);
    }
}
// check if an element is currently scrollable
function isScrollable(element) {
    const scrollable = element && element.clientHeight < element.scrollHeight;
    return scrollable;
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

<div bind:this={component} class="custom-select {className || ''}">
	<!-- hidden select to be able to handle the user inputs in forms with the default behaviour -->
	<select
		style="display: none;"
		aria-hidden="true"
		form={form || null}
		required={required || null}
		disabled={disabled || null}
		autocomplete={autocomplete || null}
		{name}
	>
		{#if initEmpty}
			<option />
		{/if}
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

	<div class="combo js-select">
		<div
			bind:this={inputEl}
			disabled={disabled || null}
			aria-disabled={disabled}
			aria-activedescendant={activedescendant}
			aria-autocomplete="none"
			aria-haspopup="listbox"
			aria-expanded={open}
			aria-owns={`listbox-${id}`}
			aria-labelledby={showLabel ? `${prefix}-label-${id} combo-selected-${id}` : null}
			aria-label={!showLabel ? labelText : null}
			id={`combo-${id}`}
			class="combo-input {disabled ? 'disabled' : ''} {open ? 'open' : ''} {showError
				? 'error'
				: ''}"
			role="combobox"
			tabindex="0"
			on:keydown|stopPropagation={handleOnInputKeyDown}
			on:blur={handleOnBlur}
			on:click={() => updateMenuState(true)}
		>
			{#if selectedDisplayName}
				{selectedDisplayName}
			{:else if placeholder}
				<span class="placeholder">{placeholder}</span>
			{/if}
		</div>
		<div
			class="combo-menu {open ? 'open' : ''}"
			role="listbox"
			id={`listbox-${id}`}
			bind:this={listboxEl}
		>
			{#each options as option, i}
				<div
					class="combo-option {option.selected ? 'option-selected' : ''} {i === activeIndex
						? 'option-current'
						: ''} {option.disabled ? 'option-disabled' : ''}"
					role="option"
					aria-selected={option.selected}
					value={option.value}
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

<style>.placeholder {
  color: var(--custom-select-placeholder-color);
}

.custom-select {
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

.combo-input {
  color: var(--input-color);
  background: var(--input-bg);
  margin: 5px 0 0 0;
  height: 2.3em;
  border: var(--input-border);
  border-color: var(--input-border-color);
  border-radius: var(--input-border-radius);
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 6px;
}
.combo-input.disabled {
  color: var(--input-disabled-color);
  background: var(--input-disabled-bg);
}
.combo-input:focus {
  outline: var(--outline);
  outline-color: var(--outline-color);
}
.combo-input.open {
  border-radius: var(--input-border-radius) var(--input-border-radius) 0 0;
}

@media (pointer: coarse) {
  .combo-input {
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

.selected-options {
  list-style-type: none;
  margin: 4px 0 -6px 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}</style>
