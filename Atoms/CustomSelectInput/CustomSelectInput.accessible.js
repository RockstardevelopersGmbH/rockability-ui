import { checkInputSize, checkColorContrast, checkInputColorContrast } from '../../utility/accessibility';
export default function checkCustomSelectAccessibility(component) {
    checkInputSize(component, '.combo-input');
    checkColorContrastInput(component);
    checkColorContrastComboMenu(component);
    checkColorContrastLabel(component);
    checkInputErrorColorContrast(component);
}
export function checkColorContrastInput(component) {
    return checkInputColorContrast(component, '--input-color', '--bg-color', '--input-bg', '--input-border-color', '--outline-color', '--input-error-highlight', '.combo-input', true, 3, 4.5);
}
export function checkColorContrastComboMenu(component) {
    return (checkInputColorContrast(component, '--input-color', '--bg-color', '--input-bg', '--input-border-color', '--outline-color', null, '.combo-option', false, 3, 4.5) &&
        checkInputColorContrast(component, '--input-color-hover', '--bg-color', '--input-bg-hover', '--input-border-color', '--outline-color', null, '.combo-option', false, 3, 4.5));
}
export function checkColorContrastLabel(component) {
    return checkColorContrast(component, '--font-color', '--bg-color', 'label');
}
// Check if displayed errors have sufficient color contrast
export function checkInputErrorColorContrast(component) {
    return checkColorContrast(component, '--input-error-color', '--bg-color', '.errorMessage');
}
