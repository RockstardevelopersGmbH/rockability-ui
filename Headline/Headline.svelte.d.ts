import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /**
             * The str property can be used to manipulate the text that is shown.
             */ str?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type HeadlineProps = typeof __propDef.props;
export declare type HeadlineEvents = typeof __propDef.events;
export declare type HeadlineSlots = typeof __propDef.slots;
export default class Headline extends SvelteComponentTyped<HeadlineProps, HeadlineEvents, HeadlineSlots> {
}
export {};
