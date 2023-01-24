import { checkColorContrast, checkInputColorContrast } from '../../utility/accessibility';
export default function checkBooleanInputAccessibility(component, showLabel) {
    checkLabelColorContrast(component);
    checkColorContrastInput(component);
    checkInputErrorColorContrast(component);
    checkIfLabelIsVisible(component, showLabel);
}
export function checkIfLabelIsVisible(component, showLabel) {
    if (showLabel !== true)
        console.error("The label has to be visible. Unless this is made on purpose, set the property 'showLabel' to 'true'.", component);
    return showLabel;
}
// Check if the label text has sufficient color contrast
export function checkLabelColorContrast(component) {
    return checkColorContrast(component, '--font-color', '--bg-color', 'label');
}
// Check if displayed errors have sufficient color contrast
export function checkInputErrorColorContrast(component) {
    return checkColorContrast(component, '--input-error-color', '--bg-color', '.errorMessage');
}
// Check if the <input> element has sufficient color contrast
export function checkColorContrastInput(component) {
    return checkInputColorContrast(component, '--boolean-selected-color', '--bg-color', '--boolean-bg', '--input-border-color', '--outline-color', '--input-error-highlight', 'input', true, 3, 3);
}
