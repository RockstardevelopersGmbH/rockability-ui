import { checkColorContrast } from '../../utility/accessibility';
export default function checkTextVideoAccessibility(component, showAccessibilityControls) {
    checkFontColorContrast(component);
    checkTextVideoSlots(component, showAccessibilityControls);
}
export function checkTextVideoSlots(component, showAccessibilityControls) {
    if (!showAccessibilityControls) {
        console.error(`The property showAccessibilityControls was set to false. This is not recommended as it makes certain accessibility features not available.`, component);
        return false;
    }
    const alternatives = component.querySelectorAll('.accessible-alternative');
    if (alternatives.length <= 0) {
        console.error(`Please provide an appropriate text alternative, audio description and sign language interpretation for the video.`, component);
        return false;
    }
    alternatives.forEach((alt) => {
        if (alt.childNodes.length <= 0) {
            console.error(`Some accessible content is missing. Please check if an appropriate text alternative, audio description and sign language interpretation for the video is provided.`, component);
            return false;
        }
    });
    return true;
}
export function checkFontColorContrast(component) {
    return checkColorContrast(component, '--font-color', '--bg-color', '.text-section', 7);
}
