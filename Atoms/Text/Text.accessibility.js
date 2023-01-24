import { checkColorContrast } from '../../utility/accessibility';
export default function checkTextAccessibility(component, easyLanguage) {
    if (easyLanguage) {
        checkFontSize(component);
        checkAlignmentForEasyLangauge(component);
        checkWhiteSpace(component);
    }
    checkAlignment(component);
    checkColorContrast(component, '--font-color', '--bg-color', '*');
}
export function checkFontSize(component) {
    let success = checkFontSizeForElement(component);
    const allNodes = component.querySelectorAll('.easyLanguage');
    for (let i = 0; i < allNodes.length; i++) {
        if (!checkFontSizeForElement(allNodes[i])) {
            success = false;
        }
    }
    return success;
}
function checkFontSizeForElement(elem) {
    const fontSize = getComputedStyle(elem).getPropertyValue('--font-size');
    try {
        const parsedFontSize = +fontSize.match(/\d*\.{0,1}\d+/g)?.join('');
        if (!parsedFontSize) {
            console.error(`Failed to parse --font-size '${fontSize}'.`, elem);
            return false;
        }
        if (!fontSize.includes('em')) {
            console.error("Please use the unit 'em' for manipulating the font-size, because the font-size has to be at least 120% of the end-users base font-size.", 'current value: ' + fontSize, elem);
            return false;
        }
        else if (parsedFontSize < 1.2) {
            console.error("Please use the unit 'em' for manipulating the font-size, because the font-size has to be at least 120% of the end-users base font-size.", elem);
            return false;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
    return true;
}
export function checkAlignment(component) {
    let success = checkAlignmentForElement(component);
    const allNodes = component.querySelectorAll('*');
    for (let i = 0; i < allNodes.length; i++) {
        if (!checkAlignmentForElement(allNodes[i])) {
            success = false;
        }
    }
    return success;
}
function checkAlignmentForElement(elem) {
    const textAlignment = getComputedStyle(elem).getPropertyValue('--text-align');
    if (textAlignment == 'justified') {
        console.error(`Text must not be justified. Current alignment is: ${textAlignment}`, elem);
        return false;
    }
    return true;
}
export function checkAlignmentForEasyLangauge(component) {
    let success = checkAlignmentForEasyLangaugeForElement(component);
    const allNodes = component.querySelectorAll('.easyLanguage');
    for (let i = 0; i < allNodes.length; i++) {
        if (!checkAlignmentForEasyLangaugeForElement(allNodes[i])) {
            success = false;
        }
    }
    return success;
}
function checkAlignmentForEasyLangaugeForElement(elem) {
    const textAlignment = getComputedStyle(elem).getPropertyValue('text-align');
    if (textAlignment !== 'left') {
        console.error(`Text must be left aligned. Current alignment is: ${textAlignment}`, elem);
        return false;
    }
    return true;
}
export function checkWhiteSpace(component) {
    let success = true;
    const allNodes = component.querySelectorAll('.easyLanguage');
    for (let i = 0; i < allNodes.length; i++) {
        if (!checkWhiteSpaceForElement(allNodes[i])) {
            success = false;
        }
    }
    return success;
}
function checkWhiteSpaceForElement(elem) {
    const whiteSpace = getComputedStyle(elem).getPropertyValue('white-space');
    if (whiteSpace !== 'pre-line') {
        console.error(`The white-space of easy language texts must have a white-space value of 'pre-line'. Current value is: ${whiteSpace}`, elem);
        return false;
    }
    return true;
}
