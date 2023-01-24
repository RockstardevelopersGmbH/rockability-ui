import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /**
             * Use this property to add custom classes and stylings to the component.
             */ className?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type SlideProps = typeof __propDef.props;
export declare type SlideEvents = typeof __propDef.events;
export declare type SlideSlots = typeof __propDef.slots;
export default class Slide extends SvelteComponentTyped<SlideProps, SlideEvents, SlideSlots> {
}
export {};
