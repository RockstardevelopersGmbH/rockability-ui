import { checkColorContrast } from '../../utility/accessibility';
export default function checkTextImageAccessibility(component) {
    checkAltTag(component);
    checkFontColorContrast(component);
    checkFullImageFontColorContrast(component);
}
export function checkAltTag(component) {
    const img = component.querySelector('img');
    if (!img.getAttribute('alt')) {
        console.error('No alt text was set for the image.', component);
        return false;
    }
    return true;
}
export function checkFullImageFontColorContrast(component) {
    return checkColorContrast(component, '--full-image-font', '--full-image-font-outline', '.text-section', 21);
}
export function checkFontColorContrast(component) {
    return checkColorContrast(component, '--font-color', '--bg-color', '.text-section', 7);
}
