import { checkColorContrast, checkAlertColorContrast } from '../../utility/accessibility';
export default function checkFormAccessibility(component, statusCloseAriaLabel, autocomplete) {
    checkIfAriaLabelWasSet(component, statusCloseAriaLabel);
    checkIfAutocompleteIsOff(component, autocomplete);
    checkFormColorContrast(component);
    checkStatusColorContrast(component);
}
export function checkIfAriaLabelWasSet(component, ariaLabel) {
    if (!ariaLabel) {
        console.error('No value for statusCloseAriaLabel was set.', component);
        return false;
    }
    return true;
}
export function checkIfAutocompleteIsOff(component, autocomplete) {
    if (autocomplete == 'off')
        console.error('Setting the value of autocomplete to off is not allowed.', component);
    return autocomplete != 'off';
}
export function checkFormColorContrast(component) {
    return checkColorContrast(component, '--font-color', '--bg-color', 'form');
}
export function checkStatusColorContrast(component) {
    return (checkAlertColorContrast(component, '--info-color', '--bg-color', '--info-bg', '--info-border-color', '.info', 3, 7) &&
        checkAlertColorContrast(component, '--success-color', '--bg-color', '--success-bg', '--success-border-color', '.success', 3, 7) &&
        checkAlertColorContrast(component, '--warn-color', '--bg-color', '--warn-bg', '--warn-border-color', '.warn', 3, 7) &&
        checkAlertColorContrast(component, '--error-color', '--bg-color', '--error-bg', '--error-border-color', '.error', 3, 7));
}
