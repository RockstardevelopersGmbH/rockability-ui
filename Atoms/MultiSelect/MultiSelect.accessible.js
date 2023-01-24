import { checkInputSize, checkColorContrast, checkInputColorContrast } from '../../utility/accessibility';
export default function checkMultiSelectAccessibility(component) {
    checkInputSize(component);
    checkAutocomplete(component);
    checkColorContrastInput(component);
    checkColorContrastComboMenu(component);
    checkColorContrastLabel(component);
    checkInputErrorColorContrast(component);
    checkColorContrastSelectedOptions(component);
}
export function checkColorContrastInput(component) {
    return checkInputColorContrast(component, '--input-color', '--bg-color', '--input-bg', '--input-border-color', '--outline-color', '--input-error-highlight', 'input', true);
}
export function checkColorContrastComboMenu(component) {
    return (checkInputColorContrast(component, '--input-color', '--bg-color', '--input-bg', '--input-border-color', '--outline-color', null, '.combo-option', false) &&
        checkInputColorContrast(component, '--input-color-hover', '--bg-color', '--input-bg-hover', '--input-border-color', '--outline-color', null, '.combo-option', false));
}
export function checkColorContrastSelectedOptions(component) {
    return (checkInputColorContrast(component, '--primary-color', '--bg-color', '--primary-bg', '--primary-border-color', '--outline-color', null, '.remove-option', false) &&
        checkInputColorContrast(component, '--primary-color-hover', '--bg-color', '--primary-bg-hover', '--primary-border-color', '--outline-color', null, '.remove-option', false));
}
export function checkColorContrastLabel(component) {
    return checkColorContrast(component, '--font-color', '--bg-color', 'label');
}
// Check if displayed errors have sufficient color contrast
export function checkInputErrorColorContrast(component) {
    return checkColorContrast(component, '--input-error-color', '--bg-color', '.errorMessage');
}
export function checkAutocomplete(component) {
    const elements = getAllElementsWithAttribute('autocomplete', component);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute('autocomplete') === 'off') {
            console.error("Do not set autocomplete to 'off'.", component, elements[i]);
            return false;
        }
    }
    return true;
}
function getAllElementsWithAttribute(attribute, component) {
    const matchingElements = [];
    const allElements = component.getElementsByTagName('*');
    for (let i = 0, n = allElements.length; i < n; i++) {
        if (allElements[i].getAttribute(attribute) !== null) {
            // Element exists with attribute. Add to array.
            matchingElements.push(allElements[i]);
        }
    }
    return matchingElements;
}
