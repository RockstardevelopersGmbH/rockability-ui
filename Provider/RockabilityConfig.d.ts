export default interface RockabilityConfig {
    isProduction: boolean;
    langCode?: {
        lang: string;
        country: string;
    };
    breakpoints: {
        [key: string]: number;
    };
}
