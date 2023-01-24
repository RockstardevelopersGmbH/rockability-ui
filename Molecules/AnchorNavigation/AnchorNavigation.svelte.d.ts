import { SvelteComponentTyped } from "svelte";
import type Anchor from '../../Interfaces/Anchor';
declare const __propDef: {
    props: {
        /**
             * Use this property to add custom classes and stylings to the component.
             */ className?: string;
        /**
             * Anchors are defined by { displayName: string, href: string, description: string }.
             * - <strong>displayName</strong>: The text that is displayed.
             * - <strong>href</strong>: The link of the navigation element.
             * - <strong>description</strong>: Should describe the purpose of the link and will be used as aria-label.
             */ anchors?: Array<Anchor>;
        /**
             * Set whether the navigation container should be sticky or not.
             */ sticky?: boolean;
        /**
             * The breakpoint when the navigation will change to a dropdown menu.
             * The approach that is used is mobile-first. So if the breakpoint is 700, the navigation
             * will change to dropdown if the window size is smaller than 700px.
             */ breakpoint?: number | string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        mobileMenu: {};
        'additional-content': {};
    };
};
export declare type AnchorNavigationProps = typeof __propDef.props;
export declare type AnchorNavigationEvents = typeof __propDef.events;
export declare type AnchorNavigationSlots = typeof __propDef.slots;
export default class AnchorNavigation extends SvelteComponentTyped<AnchorNavigationProps, AnchorNavigationEvents, AnchorNavigationSlots> {
}
export {};
