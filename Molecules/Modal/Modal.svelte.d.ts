import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /**
             * Use this property to add custom classes and stylings to the component.
             */ className?: string;
        /**
             * Unqiue identifier, which is required to prevent collisions regarding the aria-labelledy and aria-describedby attributes.
             * @required
             */ id?: string;
        /**
             * Sets the aria-label of the close button
             */ closeLabel?: string;
        /**
             * The state of the modal. Use this prop to open/close the modal.
             */ open?: boolean;
        /**
             * Sets the width of the modal. Can be any css property.
             */ width?: string;
        /**
             * Sets the height of the modal. Can be any css property.
             */ height?: string;
    };
    events: {
        closed: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        header: {};
        'close-btn': {};
        default: {};
    };
};
export declare type ModalProps = typeof __propDef.props;
export declare type ModalEvents = typeof __propDef.events;
export declare type ModalSlots = typeof __propDef.slots;
export default class Modal extends SvelteComponentTyped<ModalProps, ModalEvents, ModalSlots> {
}
export {};
