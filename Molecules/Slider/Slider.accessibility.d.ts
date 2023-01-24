import type { SwiperOptions } from 'swiper';
export default function CheckSliderAccessibilty(component: Element, swiperOptions: SwiperOptions, hasAutoplay: boolean): void;
export declare function checkColorContrastPagination(component: Element, swiperOptions: SwiperOptions): boolean;
export declare function checkAriaAttributes(component: Element, swiperOptions: SwiperOptions): boolean;
export declare function checkBreakingProperties(component: Element, swiperOptions: SwiperOptions): boolean;
export declare function checkAutoplayAccessibility(component: Element): boolean;
