import { checkColorContrast } from '../../utility/accessibility';
export default function checkModalAccessibility(component) {
    checkColorContrastModal(component);
}
export function checkColorContrastModal(component) {
    return checkColorContrast(component, '--modal-border-color', '--bg-color', null, 21);
}
