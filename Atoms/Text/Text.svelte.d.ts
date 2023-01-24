import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /**
             * Use this property to add custom classes and stylings to the component.
             */ className?: string;
        /**
             * Use this property to switch between the 'normal' content and the easy language content.
             */ easyLanguage?: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        easyLanguage: {};
        default: {};
    };
};
export declare type TextProps = typeof __propDef.props;
export declare type TextEvents = typeof __propDef.events;
export declare type TextSlots = typeof __propDef.slots;
export default class Text extends SvelteComponentTyped<TextProps, TextEvents, TextSlots> {
}
export {};
