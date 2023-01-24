import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /**
             * Use this property to add custom classes and stylings to the component.
             */ className?: string;
        /**
             * The URL that the hyperlink points to.
             * @required
             */ href?: string;
        /**
             * Provide a description for the purpose of the link.
             */ description?: string;
        /**
             * Where to display the linked URL, as the name for a browsing context (a tab, window, or <iframe>).
             */ target?: string;
        /**
             * Provide short description of an element that labels/describes the purpose of the link.
             */ label?: string;
        /**
             * The relationship of the linked URL as space-separated link types.
             */ rel?: string;
        /**
             * Inline links do not have a min-width and min-height of 44px on touchscreen devices.
             * The purpose of this property is to fulfill the success criterion https://www.w3.org/TR/WCAG21/#target-size
             */ inline?: boolean;
    };
    events: {
        click: MouseEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type LinkProps = typeof __propDef.props;
export declare type LinkEvents = typeof __propDef.events;
export declare type LinkSlots = typeof __propDef.slots;
export default class Link extends SvelteComponentTyped<LinkProps, LinkEvents, LinkSlots> {
}
export {};
