import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        direction?: string;
        width?: string;
        height?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type ChevronProps = typeof __propDef.props;
export declare type ChevronEvents = typeof __propDef.events;
export declare type ChevronSlots = typeof __propDef.slots;
export default class Chevron extends SvelteComponentTyped<ChevronProps, ChevronEvents, ChevronSlots> {
}
export {};
