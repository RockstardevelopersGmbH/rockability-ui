export default function setupCssCustomProperties(overrides = {}) {
    Object.defineProperty(window, 'getComputedStyle', {
        value: () => ({
            getPropertyValue: (prop) => {
                if (overrides[prop])
                    return overrides[prop];
                switch (prop) {
                    case '--font-size':
                        return '1.2rem';
                    case '--line-height':
                        return '1.8rem';
                    case '--font-color':
                        return '#000';
                    case '--bg-color':
                        return '#fff';
                    case '--letter-spacing':
                        return '0.144rem';
                    case '--word-spacing':
                        return '0.192rem';
                    case '--paragraph-spacing':
                        return '2.7rem';
                    case '--text-align':
                        return 'left';
                    case '--full-image-font':
                        return '#fff';
                    case '--full-image-font-outline':
                        return '#000';
                    case '--primary-color':
                        return '#000';
                    case '--primary-bg':
                        return 'rgb(148, 245, 162)';
                    case '--primary-color-hover':
                        return 'rgb(48, 96, 78)';
                    case '--primary-bg-hover':
                        return '#fff';
                    case '--primary-border-color':
                        return 'rgb(80, 160, 130)';
                    case '--secondary-color':
                        return '#fff';
                    case '--secondary-bg':
                        return 'rgb(120, 40, 111)';
                    case '--secondary-color-hover':
                        return 'rgb(120, 40, 111)';
                    case '--secondary-bg-hover':
                        return '#fff';
                    case '--secondary-border-color':
                        return 'rgb(160, 80, 151)';
                    case '--link-color':
                        return 'rgb(0, 80, 200)';
                    case '--link-color-hover':
                        return 'rgb(0, 100, 20)';
                    case '--link-color-visited':
                        return 'rgb(0, 80, 200)';
                    case '--input-color':
                        return '#000';
                    case '--input-bg':
                        return '#fff';
                    case '--input-border-color':
                        return '#888';
                    case '--input-color-hover':
                        return '#000';
                    case '--input-bg-hover':
                        return 'rgb(230, 230, 230)';
                    case '--input-error-color':
                        return 'rgb(180, 0, 0)';
                    case '--input-error-highlight':
                        return 'rgb(255, 235, 235)';
                    case '--boolean-bg':
                        return '#fff';
                    case '--boolean-selected-color':
                        return 'rgb(65, 130, 240)';
                    case '--outline-color':
                        return 'rgb(77, 144, 254)';
                    case '--info-color':
                        return '#000';
                    case '--info-bg':
                        return 'rgb(173, 224, 255)';
                    case '--info-border-color':
                        return '#5f77ff';
                    case '--success-color':
                        return '#000';
                    case '--success-bg':
                        return 'rgb(180, 230, 180)';
                    case '--success-border-color':
                        return 'rgb(0, 160, 0)';
                    case '--warn-color':
                        return '#000';
                    case '--warn-bg':
                        return 'rgb(255, 255, 170)';
                    case '--warn-border-color':
                        return 'rgb(146, 144, 11)';
                    case '--error-color':
                        return '#fff';
                    case '--error-bg':
                        return 'rgb(180, 0, 0)';
                    case '--error-border-color':
                        return 'rgb(150, 0, 0)';
                    case '--slider-pagination-bullet-border-color':
                        return '#888';
                    case '--slider-pagination-active-color':
                        return 'rgb(5, 151, 41)';
                    case '--slider-pagination-inactive-color':
                        return '#eee';
                    case '--modal-border-color':
                        return 'black';
                    default:
                }
            }
        })
    });
}
