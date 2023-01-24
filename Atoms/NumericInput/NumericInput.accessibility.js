import { checkInputSize, checkColorContrast, checkInputColorContrast } from '../../utility/accessibility';
export default function checkNumericInputAccessibility(component, showLabel, autocomplete) {
    checkInputSize(component);
    checkIfAutocompleteIsOff(component, autocomplete);
    checkIfLabelIsVisible(component, showLabel);
    checkColorContrastInput(component);
    checkColorContrastLabel(component);
    checkInputErrorColorContrast(component);
}
export function checkColorContrastInput(component) {
    return checkInputColorContrast(component, '--input-color', '--bg-color', '--input-bg', '--input-border-color', '--outline-color', '--input-error-highlight', 'input', true);
}
export function checkColorContrastLabel(component) {
    return checkColorContrast(component, '--font-color', '--bg-color', 'label');
}
// Check if displayed errors have sufficient color contrast
export function checkInputErrorColorContrast(component) {
    return checkColorContrast(component, '--input-error-color', '--bg-color', '.errorMessage');
}
export function checkIfLabelIsVisible(component, showLabel) {
    if (showLabel !== true)
        console.error("The label has to be visible. Unless this is made on purpose, set the property 'showLabel' to 'true'.", component);
    return showLabel;
}
export function checkIfAutocompleteIsOff(component, autocomplete) {
    if (autocomplete == 'off')
        console.error('Setting the value of autocomplete to off is not allowed.', component);
    return autocomplete != 'off';
}
