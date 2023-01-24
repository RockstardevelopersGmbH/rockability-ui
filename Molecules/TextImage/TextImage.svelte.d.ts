import { SvelteComponentTyped } from "svelte";
import type AspectRatioType from '../../Interfaces/AspectRatio';
declare const __propDef: {
    props: {
        /**
             * The image source.
             * @required
             */ src?: string;
        /**
             * Text description of the image.
             * @required
             */ alt?: string;
        /**
             * Use this property to add custom classes and stylings to the component.
             */ className?: string;
        /**
             * Set the width of the text section in percentage. The media section will receive the remaining width.
             *
             * This is only true if the TextVideo component is NOT in mobile mode. The component will switch to the mobile mode
             * according to the set breakpoint.
             */ textWidth?: number;
        /**
             * The breakpoint when the video and text will be displayed on top of each other instead of besides each other.
             * The approach that is used is mobile-first. So if the breakpoint is 700, the video and text will be on top of each other,
             * if the window size is smaller than 700px.
             */ breakpoint?: number | string;
        /**
             * This property can be used to set if the text should be rendered before or after the video.
             */ renderTextFirst?: boolean;
        /**
             * This property controls whether the text and the image will be displayed next to eacht other, or the
             * image will be displayed with full width and height with the text being on top of the image.
             */ fullImageMode?: boolean;
        /**
             * If this property is set to true, the TextImage component will set fullImageMode to false
             * at the mobile viewport.
             */ exitFullImageModeOnMobile?: boolean;
        /**
             * If aspectRatios are provided the AspectRatio component will be wrapped around the <img /> tag
             * with the corresponding configs being passed over.
             *
             * The aspect ratios are an Array of { breakpoint: number | string; ratio: number; }
             * - <strong>breakpoint</strong>: The name of the breakpoint (e.g. md).
             * - <strong>ratio</strong>: The aspect ratio.
             *
             * @example
             * If you want to have an aspect ratio of 16:9 in the 'md'-breakpoint, the config would
             * look like this: { breakpoint: 'md', ratio; 16 / 9 } or { breakpoint: 762, ratio; 16 / 9 }
             */ aspectRatios: Array<AspectRatioType>;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        text: {};
    };
};
export declare type TextImageProps = typeof __propDef.props;
export declare type TextImageEvents = typeof __propDef.events;
export declare type TextImageSlots = typeof __propDef.slots;
export default class TextImage extends SvelteComponentTyped<TextImageProps, TextImageEvents, TextImageSlots> {
}
export {};
