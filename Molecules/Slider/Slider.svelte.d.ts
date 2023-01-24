import { SvelteComponentTyped } from "svelte";
import type { SwiperOptions } from 'swiper';
declare const __propDef: {
    props: {
        /**
             * options for the Swiper API.
             *
             * NOTE: The options will be deep merged with the default options.
             *
             * For more information see: https://swiperjs.com/swiper-api
             */ options: SwiperOptions;
        /**
             * Can be used to (not) render the default navigation buttons.
             */ defaultNavigation?: boolean;
        /**
             * Can be used to (not) render the default pagination container.
             */ defaultPagination?: boolean;
        /**
             * In order to fulfill Success Criterion 2.2.2 (Pause, Stop, Hide), a play/pause button is required
             * if autplay is enabled. Set this property only to 'false' if this criterion must not be met.
             */ showPlayPauseButton?: boolean;
        /**
             * If autoplay is enabled, by default the pagination will be rendered left below
             * the slider and the play/pause button right below the slider. Use this property to force
             * centering the pagination bullets.
             */ forcePaginationCenter?: boolean;
        /**
             * Set the aria-label for the play button.
             */ playLabel?: string;
        /**
             * Set the aria-label for the pause button.
             */ pauseLabel?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            swiper: any;
        };
        'additional-controls': {};
    };
};
export declare type SliderProps = typeof __propDef.props;
export declare type SliderEvents = typeof __propDef.events;
export declare type SliderSlots = typeof __propDef.slots;
export default class Slider extends SvelteComponentTyped<SliderProps, SliderEvents, SliderSlots> {
}
export {};
