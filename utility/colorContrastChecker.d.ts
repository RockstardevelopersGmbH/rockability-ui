export declare enum ErrorTypes {
    ParsingError = 0,
    BackgroundTransparencyError = 1,
    None = 2
}
export declare type ColorContrastError = {
    error: boolean;
    errorType: ErrorTypes;
    contrastRatio: number;
};
export default function checkColorContrast(foregroundColor: string, backgroundColor: string): ColorContrastError;
