import { checkInputSize, checkColorContrast } from '../../utility/accessibility';
export default function checkLinkAccessibility(component, inline) {
    checkLinkText(component);
    checkLinkDescription(component);
    if (!inline) {
        checkInputSize(component, 'a');
    }
    checkLinkColorContrast(component);
    checkOutlineColorContrast(component);
}
export function checkLinkText(component) {
    if (!component.textContent) {
        console.error('A link is required to have a meaningful text inside.', component);
        return false;
    }
    return true;
}
export function checkLinkDescription(component) {
    const ariaLabel = component.querySelector('a').getAttribute('aria-label');
    const ariaLabelledyBy = component.querySelector('a').getAttribute('aria-labelledby');
    if (!ariaLabel && !ariaLabelledyBy) {
        console.error('A link must have a programatic description of the purpose of the link. Please set a value for label or description.', component);
        return false;
    }
    return true;
}
export function checkLinkColorContrast(component) {
    return (checkColorContrast(component, '--link-color', '--bg-color', 'a', 7) &&
        checkColorContrast(component, '--link-color-hover', '--bg-color', 'a', 7) &&
        checkColorContrast(component, '--link-color-visited', '--bg-color', 'a', 7));
}
export function checkOutlineColorContrast(component) {
    return checkColorContrast(component, '--outline-color', '--bg-color', 'a', 3);
}
