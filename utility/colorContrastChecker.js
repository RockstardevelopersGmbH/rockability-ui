import Color from 'color';
export var ErrorTypes;
(function (ErrorTypes) {
    ErrorTypes[ErrorTypes["ParsingError"] = 0] = "ParsingError";
    ErrorTypes[ErrorTypes["BackgroundTransparencyError"] = 1] = "BackgroundTransparencyError";
    ErrorTypes[ErrorTypes["None"] = 2] = "None";
})(ErrorTypes || (ErrorTypes = {}));
export default function checkColorContrast(foregroundColor, backgroundColor) {
    let fgColor;
    let bgColor;
    try {
        fgColor = Color(foregroundColor.replace('!important', '').trim());
        bgColor = Color(backgroundColor.replace('!important', '').trim());
    }
    catch (error) {
        return {
            error: true,
            errorType: ErrorTypes.ParsingError,
            contrastRatio: null
        };
    }
    // Check if color or backgroundColor has a alpha < 1
    if (bgColor.alpha() < 1) {
        return {
            error: true,
            errorType: ErrorTypes.BackgroundTransparencyError,
            contrastRatio: null
        };
    }
    if (fgColor.alpha() < 1) {
        // Put the alpha values into the calculations
        fgColor = fgColor
            .rgb()
            .red(fgColor.rgb().red() * fgColor.alpha() + bgColor.rgb().red() * (1 - fgColor.alpha()));
        fgColor = fgColor
            .rgb()
            .green(fgColor.rgb().green() * fgColor.alpha() + bgColor.rgb().green() * (1 - fgColor.alpha()));
        fgColor = fgColor
            .rgb()
            .blue(fgColor.rgb().blue() * fgColor.alpha() + bgColor.rgb().blue() * (1 - fgColor.alpha()));
        fgColor = fgColor.alpha(1);
    }
    const contrastRatio = bgColor.contrast(fgColor);
    return {
        error: false,
        errorType: ErrorTypes.None,
        contrastRatio: contrastRatio
    };
}
