import colorContrastChecker, { ErrorTypes } from './colorContrastChecker';
export function checkInputSize(component, selector = 'input') {
    const inputs = component.querySelectorAll(selector);
    if (!window.matchMedia('(pointer: coarse)').matches) {
        return true;
    }
    for (let i = 0; i < inputs.length; i++) {
        const width = getComputedStyle(inputs[i]).getPropertyValue('min-width');
        const height = getComputedStyle(inputs[i]).getPropertyValue('min-height');
        const parsedWidth = width ? +width.match(/\d*\.{0,1}\d+/g)?.join('') : 0;
        const parsedHeight = height ? +height.match(/\d*\.{0,1}\d+/g)?.join('') : 0;
        if (parsedWidth < 44) {
            console.error(`The min-width of the element ${inputs[i].tagName} must be at least 44px.`, inputs[i]);
            return false;
        }
        if (parsedHeight < 44) {
            console.error(`The min-height of the element ${inputs[i].tagName} must be at least 44px.`, inputs[i]);
            return false;
        }
    }
    return true;
}
/**
 * This utility method checks an component on valid color contrasts.
 * Errors will be printed in the console, if anything went wrong or if the
 * color contrast of an element does not meet the critera of WCAG 2.1
 *
 * @param component The scope to search in
 * @param fgColor The css prop of the foreground color (most likely the name of a CSS custom property)
 * @param bgColor The css prop of the background color (most likely the name of a CSS custom property)
 * @param selector The selector that is used to fetch all nodes inside the @param component that the color is checked on.
 * @param minimumRatio The minimum contrast ratio needed to return successfully
 * @returns true if all color contrasts are fine, otherwise false.
 */
export function checkColorContrast(component, fgColor, bgColor, selector = '*', minimumRatio = 7) {
    let inputs = [component];
    if (selector)
        inputs = Array.from(component.querySelectorAll(selector));
    let success = true;
    for (let i = 0; i < inputs.length; i++) {
        if (!checkColorContrastForElement(fgColor, bgColor, inputs[i], minimumRatio)) {
            success = false;
        }
    }
    return success;
}
function checkColorContrastForElement(fgColor, bgColor, elem, minimumRatio) {
    const foregroundColor = getComputedStyle(elem).getPropertyValue(fgColor);
    const backgroundColor = getComputedStyle(elem).getPropertyValue(bgColor);
    const contrast = colorContrastChecker(foregroundColor, backgroundColor);
    const k = {
        result: contrast,
        fgColor: fgColor,
        bgColor: bgColor,
        fgColorParsed: foregroundColor,
        bgColorParsed: backgroundColor
    };
    if (!hasNoErrors(k, elem))
        return false;
    if (!handleWrongContrast(k, minimumRatio, elem))
        return false;
    return true;
}
export function checkInputColorContrast(component, fontColor, bgColor, inputBgColor, borderColor, outlineColor, errorHighlightColor, selector = '*', hasErrorHighlight = true, minimumRatio = 3, fontMinimumRatio = 7) {
    const inputs = component.querySelectorAll(selector);
    let success = true;
    for (let i = 0; i < inputs.length; i++) {
        if (!checkInputColorContrastForElement(inputs[i], fontColor, bgColor, inputBgColor, errorHighlightColor, borderColor, outlineColor, hasErrorHighlight, minimumRatio, fontMinimumRatio)) {
            success = false;
        }
    }
    return success;
}
function checkInputColorContrastForElement(elem, fontColor, bgColor, inputBgColor, errorHighlightColor, borderColor, outlineColor, hasErrorHighlight, minimumRatio, fontMinimumRatio) {
    const font = getComputedStyle(elem).getPropertyValue(fontColor);
    const background = getComputedStyle(elem).getPropertyValue(bgColor);
    const inputBg = getComputedStyle(elem).getPropertyValue(inputBgColor);
    const border = getComputedStyle(elem).getPropertyValue(borderColor);
    const outline = getComputedStyle(elem).getPropertyValue(outlineColor);
    let errorHighlight = null;
    if (hasErrorHighlight)
        errorHighlight = getComputedStyle(elem).getPropertyValue(errorHighlightColor);
    const contrast1 = colorContrastChecker(font, inputBg);
    let contrast2 = null;
    const contrast3 = colorContrastChecker(outline, background);
    const contrast4 = colorContrastChecker(border, background);
    const contrast5 = colorContrastChecker(inputBg, background);
    let contrast6 = null;
    if (hasErrorHighlight) {
        contrast2 = colorContrastChecker(font, errorHighlight);
        contrast6 = colorContrastChecker(errorHighlight, background);
    }
    const results = {
        k1: {
            result: contrast1,
            fgColor: fontColor,
            bgColor: inputBgColor,
            fgColorParsed: font,
            bgColorParsed: inputBg
        },
        k2: {
            result: contrast2,
            fgColor: fontColor,
            bgColor: errorHighlightColor,
            fgColorParsed: font,
            bgColorParsed: errorHighlight
        },
        k3: {
            result: contrast3,
            fgColor: outlineColor,
            bgColor: bgColor,
            fgColorParsed: outline,
            bgColorParsed: background
        },
        k4: {
            result: contrast4,
            fgColor: borderColor,
            bgColor: bgColor,
            fgColorParsed: border,
            bgColorParsed: background
        },
        k5: {
            result: contrast5,
            fgColor: inputBgColor,
            bgColor: bgColor,
            fgColorParsed: inputBg,
            bgColorParsed: background
        },
        k6: {
            result: contrast6,
            fgColor: errorHighlightColor,
            bgColor: bgColor,
            fgColorParsed: errorHighlight,
            bgColorParsed: background
        }
    };
    // Check results on errors
    let noErrors = hasNoErrors(results.k1, elem) &&
        hasNoErrors(results.k3, elem) &&
        hasNoErrors(results.k4, elem) &&
        hasNoErrors(results.k5, elem);
    if (hasErrorHighlight) {
        noErrors = noErrors && hasNoErrors(results.k2, elem) && hasNoErrors(results.k6, elem);
    }
    if (!noErrors)
        return false;
    // Check contrast ratios
    if (!handleWrongContrast(results.k1, fontMinimumRatio, elem))
        return false;
    if (hasErrorHighlight && !handleWrongContrast(results.k2, fontMinimumRatio, elem))
        return false;
    if (!handleWrongContrast(results.k3, minimumRatio, elem))
        return false;
    if (!(results.k4.result.contrastRatio >= minimumRatio ||
        (hasErrorHighlight &&
            results.k5.result.contrastRatio >= minimumRatio &&
            results.k6.result.contrastRatio >= minimumRatio) ||
        (!hasErrorHighlight && results.k5.result.contrastRatio >= minimumRatio))) {
        let errorMsg;
        if (hasErrorHighlight) {
            errorMsg = `Either the contrast ratio between (${results.k4.fgColor}/${results.k4.bgColor}) OR the contrast ratio between
			(${results.k5.fgColor}/${results.k5.bgColor}) and (${results.k6.fgColor}/${results.k6.bgColor})
			must be at least ${minimumRatio}:1. 
			Current contrast ratios: \n 
			(${results.k4.fgColor}/${results.k4.bgColor}): ${results.k4.result.contrastRatio.toFixed(2)}:1 \n
			(${results.k5.fgColor}/${results.k5.bgColor}): ${results.k5.result.contrastRatio.toFixed(2)}:1 \n
			(${results.k6.fgColor}/${results.k6.bgColor}): ${results.k6.result.contrastRatio.toFixed(2)}:1 \n`;
        }
        else {
            errorMsg = `Either the contrast ratio between (${results.k4.fgColor}/${results.k4.bgColor}) OR the contrast ratio between
			(${results.k5.fgColor}/${results.k5.bgColor})
			must be at least ${minimumRatio}:1. 
			Current contrast ratios: \n 
			(${results.k4.fgColor}/${results.k4.bgColor}): ${results.k4.result.contrastRatio.toFixed(2)}:1 \n
			(${results.k5.fgColor}/${results.k5.bgColor}): ${results.k5.result.contrastRatio.toFixed(2)}:1 \n`;
        }
        console.error(errorMsg.replaceAll('	', ''), elem);
        return false;
    }
    return true;
}
export function checkAlertColorContrast(component, fontColor, bgColor, alertBgColor, borderColor, selector = '*', minimumRatio = 3, fontMinimumRatio = 7) {
    const inputs = component.querySelectorAll(selector);
    let success = true;
    for (let i = 0; i < inputs.length; i++) {
        if (!checkAlertColorContrastForElement(inputs[i], fontColor, bgColor, alertBgColor, borderColor, minimumRatio, fontMinimumRatio)) {
            success = false;
        }
    }
    return success;
}
function checkAlertColorContrastForElement(elem, fontColor, bgColor, alertBgColor, borderColor, minimumRatio, fontMinimumRatio) {
    const font = getComputedStyle(elem).getPropertyValue(fontColor);
    const background = getComputedStyle(elem).getPropertyValue(bgColor);
    const inputBg = getComputedStyle(elem).getPropertyValue(alertBgColor);
    const border = getComputedStyle(elem).getPropertyValue(borderColor);
    const contrast1 = colorContrastChecker(font, inputBg);
    const contrast2 = colorContrastChecker(border, background);
    const contrast3 = colorContrastChecker(inputBg, background);
    const results = {
        k1: {
            result: contrast1,
            fgColor: fontColor,
            bgColor: alertBgColor,
            fgColorParsed: font,
            bgColorParsed: inputBg
        },
        k2: {
            result: contrast2,
            fgColor: borderColor,
            bgColor: bgColor,
            fgColorParsed: border,
            bgColorParsed: background
        },
        k3: {
            result: contrast3,
            fgColor: alertBgColor,
            bgColor: bgColor,
            fgColorParsed: inputBg,
            bgColorParsed: background
        }
    };
    // Check results on errors
    if (!hasNoErrors(results.k1, elem) ||
        !hasNoErrors(results.k2, elem) ||
        !hasNoErrors(results.k3, elem))
        return false;
    // Check contrast ratios
    if (!handleWrongContrast(results.k1, fontMinimumRatio, elem))
        return false;
    if (!(results.k2.result.contrastRatio >= minimumRatio ||
        results.k3.result.contrastRatio >= minimumRatio)) {
        const errorMsg = `Either the contrast ratio between (${results.k2.fgColor}/${results.k2.bgColor}) OR the contrast ratio between
			(${results.k3.fgColor}/${results.k3.bgColor})
			must be at least ${minimumRatio}:1. 
			Current contrast ratios: \n 
			(${results.k2.fgColor}/${results.k2.bgColor}): ${results.k2.result.contrastRatio.toFixed(2)}:1 \n
			(${results.k3.fgColor}/${results.k3.bgColor}): ${results.k3.result.contrastRatio.toFixed(2)}:1 \n`;
        console.error(errorMsg.replaceAll('	', ''), elem);
        return false;
    }
    return true;
}
export function checkBulletPointColorContrast(component, activeColor, bgColor, inactiveColor, outlineColor, borderColor, selector = '*', minimumRatio = 3) {
    const elements = component.querySelectorAll(selector);
    let success = true;
    for (let i = 0; i < elements.length; i++) {
        if (!checkBulletPointColorContrastForElement(elements[i], activeColor, bgColor, inactiveColor, outlineColor, borderColor, minimumRatio)) {
            success = false;
        }
    }
    return success;
}
function checkBulletPointColorContrastForElement(elem, activeColor, bgColor, inactiveColor, outlineColor, borderColor, minimumRatio = 3) {
    const active = getComputedStyle(elem).getPropertyValue(activeColor);
    const background = getComputedStyle(elem).getPropertyValue(bgColor);
    const inactive = getComputedStyle(elem).getPropertyValue(inactiveColor);
    const outline = getComputedStyle(elem).getPropertyValue(outlineColor);
    const border = getComputedStyle(elem).getPropertyValue(borderColor);
    const contrast1 = colorContrastChecker(active, background);
    const contrast2 = colorContrastChecker(inactive, background);
    const contrast3 = colorContrastChecker(outline, background);
    const contrast4 = colorContrastChecker(active, inactive);
    const contrast5 = colorContrastChecker(border, background);
    const results = {
        k1: {
            result: contrast1,
            fgColor: activeColor,
            bgColor: bgColor,
            fgColorParsed: active,
            bgColorParsed: background
        },
        k2: {
            result: contrast2,
            fgColor: inactiveColor,
            bgColor: bgColor,
            fgColorParsed: inactive,
            bgColorParsed: background
        },
        k3: {
            result: contrast3,
            fgColor: outlineColor,
            bgColor: bgColor,
            fgColorParsed: outline,
            bgColorParsed: background
        },
        k4: {
            result: contrast4,
            fgColor: activeColor,
            bgColor: inactiveColor,
            fgColorParsed: active,
            bgColorParsed: inactive
        },
        k5: {
            result: contrast5,
            fgColor: borderColor,
            bgColor: bgColor,
            fgColorParsed: border,
            bgColorParsed: background
        }
    };
    // Check results on errors
    if (!hasNoErrors(results.k1, elem) ||
        !hasNoErrors(results.k2, elem) ||
        !hasNoErrors(results.k3, elem) ||
        !hasNoErrors(results.k4, elem) ||
        !hasNoErrors(results.k5, elem))
        return false;
    // Check contrast ratios
    if (!handleWrongContrast(results.k3, minimumRatio, elem))
        return false;
    if (!handleWrongContrast(results.k4, minimumRatio, elem))
        return false;
    // Check contrast ratios
    if (!(results.k5.result.contrastRatio >= minimumRatio ||
        (results.k1.result.contrastRatio >= minimumRatio &&
            results.k2.result.contrastRatio >= minimumRatio))) {
        const errorMsg = `Either the contrast ratio between (${results.k5.fgColor}/${results.k5.bgColor}) OR the contrast ratio between
			(${results.k1.fgColor}/${results.k1.bgColor}) and (${results.k2.fgColor}/${results.k2.bgColor})
			must be at least ${minimumRatio}:1. 
			Current contrast ratios: \n 
			(${results.k5.fgColor}/${results.k5.bgColor}): ${results.k5.result.contrastRatio.toFixed(2)}:1
			(${results.k1.fgColor}/${results.k1.bgColor}): ${results.k1.result.contrastRatio.toFixed(2)}:1
			(${results.k2.fgColor}/${results.k2.bgColor}): ${results.k2.result.contrastRatio.toFixed(2)}:1`;
        console.error(errorMsg.replaceAll('	', ''), elem);
        return false;
    }
    return true;
}
function hasNoErrors(k, elem) {
    if (k.result.error) {
        switch (k.result.errorType) {
            case ErrorTypes.ParsingError:
                console.error(`Failed to parse colors. \n ${k.fgColor}: ${k.fgColorParsed} \n ${k.bgColor}: ${k.bgColorParsed} \n`, elem);
                return false;
            case ErrorTypes.BackgroundTransparencyError:
                console.error(`${k.bgColor} has an alpha value < 1.0. Note that the color contrast cannot be calculated as 
			there is no way to determine what color lays behind the background. Please don't use an alpha channel for ${k.bgColor}. 
			The color contrast won't be calculated otherwise. Current value is: ${k.bgColorParsed}`, elem);
                return false;
            default:
                console.error('An undefined error occured.', elem);
                return false;
        }
    }
    return true;
}
function handleWrongContrast(k, minimumRatio, elem) {
    if (!(k.result.contrastRatio >= minimumRatio)) {
        const errorMsg = `The contrast ratio between ${k.fgColor} and ${k.bgColor} must be at least ${minimumRatio}:1.\nCurrent contrast ratio is: ${k.result.contrastRatio.toFixed(2)}:1 \n${k.fgColor}: ${k.fgColorParsed} \n${k.bgColor}: ${k.bgColorParsed}`;
        console.error(errorMsg.replaceAll('	', ''), elem);
        return false;
    }
    return true;
}
