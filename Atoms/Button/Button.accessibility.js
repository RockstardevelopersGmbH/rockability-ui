import { checkInputSize, checkInputColorContrast } from '../../utility/accessibility';
export default function checkButtonAccessibility(component, theme) {
    checkInputSize(component, 'button');
    checkButtonText(component);
    switch (theme) {
        case 'primary':
            checkButtonPrimaryColorContrast(component);
            break;
        case 'secondary':
            checkButtonSecondaryColorContrast(component);
            break;
        default:
            checkButtonDefaultColorContrast(component);
            break;
    }
}
export function checkButtonText(component) {
    const text = component.textContent;
    const ariaLabel = component.querySelector('button').getAttribute('aria-label');
    if (!text && !ariaLabel) {
        console.error('A button is required to have a meaningful text inside and that the ariaLabel property is set according to that text.', component);
        return false;
    }
    return true;
}
export function checkButtonPrimaryColorContrast(component) {
    return (checkInputColorContrast(component, '--primary-color', '--bg-color', '--primary-bg', '--primary-border-color', '--outline-color', null, '.primary', false) &&
        checkInputColorContrast(component, '--primary-color-hover', '--bg-color', '--primary-bg-hover', '--primary-border-color', '--outline-color', null, '.primary', false));
}
export function checkButtonSecondaryColorContrast(component) {
    return (checkInputColorContrast(component, '--secondary-color', '--bg-color', '--secondary-bg', '--secondary-border-color', '--outline-color', null, '.secondary', false) &&
        checkInputColorContrast(component, '--secondary-color-hover', '--bg-color', '--secondary-bg-hover', '--secondary-border-color', '--outline-color', null, '.secondary', false));
}
export function checkButtonDefaultColorContrast(component) {
    return (checkInputColorContrast(component, '--input-color', '--bg-color', '--input-bg', '--input-border-color', '--outline-color', null, '.default', false) &&
        checkInputColorContrast(component, '--input-color-hover', '--bg-color', '--input-bg-hover', '--input-border-color', '--outline-color', null, '.default', false));
}
