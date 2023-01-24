import { SvelteComponentTyped } from "svelte";
/**
     * An AspectRatio component that can be used to force elements to a specific aspect ratio for certain breakpoints.
     * @component
     */
import type AspectRatio from '../../Interfaces/AspectRatio';
declare const __propDef: {
    props: {
        /**
             * A unique identifier used as a post fix for the css classes used in this component to avoid collisions.
             * @required
             */ id?: string;
        /**
             * The aspect ratios are an Array of { breakpoint: number | string; ratio: number; }
             * - <strong>breakpoint</strong>: The name of the breakpoint (e.g. md).
             * - <strong>ratio</strong>: The aspect ratio.
             *
             * @example
             * If you want to have an aspect ratio of 16:9 in the 'md'-breakpoint, the config would
             * look like this: { breakpoint: 'md', ratio; 16 / 9 } or { breakpoint: 762, ratio; 16 / 9 }
             */ aspectRatios: Array<AspectRatio>;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type AspectRatioProps = typeof __propDef.props;
export declare type AspectRatioEvents = typeof __propDef.events;
export declare type AspectRatioSlots = typeof __propDef.slots;
export default class AspectRatio extends SvelteComponentTyped<AspectRatioProps, AspectRatioEvents, AspectRatioSlots> {
}
export {};
