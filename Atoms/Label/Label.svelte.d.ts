import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        showLabel?: boolean;
        id?: string;
        labelText?: string;
        prefix?: string;
        className?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        label: {};
    };
};
export declare type LabelProps = typeof __propDef.props;
export declare type LabelEvents = typeof __propDef.events;
export declare type LabelSlots = typeof __propDef.slots;
export default class Label extends SvelteComponentTyped<LabelProps, LabelEvents, LabelSlots> {
}
export {};
