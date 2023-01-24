export declare function checkInputSize(component: Element, selector?: string): boolean;
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
export declare function checkColorContrast(component: Element, fgColor: string, bgColor: string, selector?: string, minimumRatio?: number): boolean;
export declare function checkInputColorContrast(component: Element, fontColor: string, bgColor: string, inputBgColor: string, borderColor: string, outlineColor: string, errorHighlightColor: string, selector?: string, hasErrorHighlight?: boolean, minimumRatio?: number, fontMinimumRatio?: number): boolean;
export declare function checkAlertColorContrast(component: Element, fontColor: string, bgColor: string, alertBgColor: string, borderColor: string, selector?: string, minimumRatio?: number, fontMinimumRatio?: number): boolean;
export declare function checkBulletPointColorContrast(component: Element, activeColor: string, bgColor: string, inactiveColor: string, outlineColor: string, borderColor: string, selector?: string, minimumRatio?: number): boolean;
