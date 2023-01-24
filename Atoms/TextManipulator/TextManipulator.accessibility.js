import { checkInputSize, checkColorContrast, checkInputColorContrast } from '../../utility/accessibility';
export default function checkTextManipulatorAccessibility(component, lineSpacingLabel, paragraphSpacingLabel) {
    checkInputSize(component);
    checkLabelTexts(component, lineSpacingLabel, paragraphSpacingLabel);
    checkColorContrastInput(component);
    checkColorContrastLabel(component);
    checkUnitBoxColorContrast(component);
}
export function checkLabelTexts(component, lineSpacingLabel, paragraphSpaningLabel) {
    if (lineSpacingLabel && paragraphSpaningLabel)
        return true;
    if (!lineSpacingLabel)
        console.error('Please set a value for lineSpacingLabelText.', component);
    if (!paragraphSpaningLabel)
        console.error('Please set a value for paragraphSpacingLabelText.', component);
    return false;
}
export function checkColorContrastInput(component) {
    return checkInputColorContrast(component, '--input-color', '--bg-color', '--input-bg', '--input-border-color', '--outline-color', '--input-error-highlight', 'input', true);
}
export function checkColorContrastLabel(component) {
    return checkColorContrast(component, '--font-color', '--bg-color', 'label');
}
export function checkUnitBoxColorContrast(component) {
    return checkColorContrast(component, '--font-color', '--unit-box-bg', '.unit-box');
}
