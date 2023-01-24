import { checkInputSize, checkBulletPointColorContrast } from '../../utility/accessibility';
export default function CheckSliderAccessibilty(component, swiperOptions, hasAutoplay) {
    checkInputSize(component, '.slider-chevron');
    checkColorContrastPagination(component, swiperOptions);
    checkBreakingProperties(component, swiperOptions);
    checkAriaAttributes(component, swiperOptions);
    if (hasAutoplay) {
        checkAutoplayAccessibility(component);
    }
}
export function checkColorContrastPagination(component, swiperOptions) {
    const bulletClass = (swiperOptions.pagination && swiperOptions.pagination.bulletClass) ??
        '.swiper-pagination-bullet';
    if (bulletClass.toString() !== '.swiper-pagination-bullet') {
        console.warn(`It appears that the class name of the pagination bullets changed. Therefore, no checks on the color contrast ratio can be made. Current bullet class is: ${bulletClass}`, component);
        return false;
    }
    return checkBulletPointColorContrast(component, '--slider-pagination-active-color', '--bg-color', '--slider-pagination-inactive-color', '--outline-color', '--slider-pagination-bullet-border-color', bulletClass.toString());
}
export function checkAriaAttributes(component, swiperOptions) {
    // .slider-nav must have aria-label, role=='button', aria-controls -> .swiper-wrapper
    const swiperWrapperClass = swiperOptions.wrapperClass ?? '.swiper-wrapper';
    const prevBtnClass = swiperOptions.navigation && swiperOptions.navigation.prevEl
        ? swiperOptions.navigation.prevEl
        : '.prev-button';
    const nextBtnClass = swiperOptions.navigation && swiperOptions.navigation.nextEl
        ? swiperOptions.navigation.prevEl
        : '.next-button';
    const swiperWrapper = component.querySelector(swiperWrapperClass);
    if (!swiperWrapper) {
        console.error(`Failed to find swiper wrapper for class '${swiperWrapperClass}'. Cannot process all accessibility.`, component);
        return false;
    }
    const swiperWrapperId = swiperWrapper.getAttribute('id');
    if (!checkNavButtonAccessibility(component, prevBtnClass.toString(), swiperWrapperId) ||
        !checkNavButtonAccessibility(component, nextBtnClass.toString(), swiperWrapperId))
        return false;
    // .swiper-slides must have aria-label and role
    const slideClass = swiperOptions.slideClass ?? '.swiper-slide';
    const slides = component.querySelectorAll(slideClass.toString());
    for (let i = 0; i < slides.length; i++) {
        const label = slides[i].getAttribute('aria-label');
        const role = slides[i].getAttribute('role');
        if (label && role)
            return true;
        if (!label) {
            console.error(`No value for slideLabelMessage was found. Please set a value for slideLabelMessage to give the slides an appropriate aria-label.`, slides[i]);
        }
        if (!role) {
            console.error(`No value for slideRole was found. Please set a value for slideRole to give the slides an appropriate role attribute.`, slides[i]);
        }
        return false;
    }
    // .swiper-pagination-bullet must have aria-label
    const bulletClass = swiperOptions.pagination && swiperOptions.pagination.bulletClass
        ? swiperOptions.pagination.bulletClass
        : '.swiper-pagination-bullet';
    const paginationBullet = component.querySelectorAll(bulletClass.toString());
    for (let i = 0; i < paginationBullet.length; i++) {
        const label = paginationBullet[i].getAttribute('aria-label');
        if (label)
            return true;
        if (!label) {
            console.error(`No value for paginationBulletMessage was found. Please set a value for paginationBulletMessage to give the pagination bullets an appropriate aria-label.`, paginationBullet[i]);
        }
        return false;
    }
    return true;
}
export function checkBreakingProperties(component, swiperOptions) {
    let success = true;
    if (swiperOptions.allowTouchMove === false) {
        console.error(`allowTouchMove should be set to true.`, component);
        success = false;
    }
    if (swiperOptions.swipeHandler) {
        console.warn(`When using a swipeHandler, accessibility checks may not be processed on the corresponding swipeHandler Element. Use at own risk.`, component);
        success = false;
    }
    return success;
}
export function checkAutoplayAccessibility(component) {
    const playPauseBtn = component.querySelector('.play-pause-btn');
    if (!playPauseBtn) {
        console.error('If autoplay is enabled in the slider, a play/pause button is required to stop/resume the animation. However, no play/pause button was found.', component);
        return false;
    }
    return true;
}
function checkNavButtonAccessibility(component, selector, swiperWrapperId) {
    const navigations = component.querySelectorAll(selector);
    for (let i = 0; i < navigations.length; i++) {
        const label = navigations[i].getAttribute('aria-label');
        const role = navigations[i].getAttribute('role');
        const ariaControls = navigations[i].getAttribute('aria-controls');
        if (label && role === 'button' && ariaControls === swiperWrapperId)
            return true;
        if (!label) {
            console.error(`No aria-label for the slide navigation controls were found.`, navigations[i]);
        }
        if (role !== 'button') {
            console.error(`The role on the slide navigation control must be 'button' but found: '${role}'`, navigations[i]);
        }
        if (ariaControls !== swiperWrapperId) {
            console.error(`Something went wrong. The slide navigation control do not have an aria-controls attribute, pointing to ${swiperWrapperId}.`, navigations[i]);
        }
        return false;
    }
}
