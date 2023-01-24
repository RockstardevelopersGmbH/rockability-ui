import { SvelteComponentTyped } from "svelte";
import type TextVideoAccessibilityControls from '../../Interfaces/TextVideoAccessibilityControls';
declare const __propDef: {
    props: {
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
             * Toggle the accessibility controls for the accisible content.
             */ showAccessibilityControls?: boolean;
        /**
             * Settings for displayTexts and aria-labels for the accessibility controls.
             * These are of type @type {TextVideoAccessibilityControls}
             */ accessibilityControlsSettings?: TextVideoAccessibilityControls;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        text: {};
        video: {};
        'text-alternative': {};
        'audio-description': {};
        'sign-language-interpretation': {};
    };
};
export declare type TextVideoProps = typeof __propDef.props;
export declare type TextVideoEvents = typeof __propDef.events;
export declare type TextVideoSlots = typeof __propDef.slots;
export default class TextVideo extends SvelteComponentTyped<TextVideoProps, TextVideoEvents, TextVideoSlots> {
}
export {};
