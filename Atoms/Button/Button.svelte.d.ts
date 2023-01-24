import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /**
             * Sets the type of the button. Valid values are:
             * 'default', 'submit', 'reset', 'cancel'
             */ type?: string;
        /**
             * Use this property to add custom classes and stylings to the component.
             */ className?: string;
        /**
             * Use this property to define the style of the button
             * Valid values are: ['default', 'primary', 'secondary']
             *
             * If an invalid theme string is passed, the fallback will be 'default'
             */ theme?: string;
        /**
             * Specifies that an input element should be disabled.
             */ disabled?: boolean;
        /**
             * Use this prop to set an aria-label on the button.
             * @required
             */ ariaLabel?: string;
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
export declare type ButtonProps = typeof __propDef.props;
export declare type ButtonEvents = typeof __propDef.events;
export declare type ButtonSlots = typeof __propDef.slots;
export default class Button extends SvelteComponentTyped<ButtonProps, ButtonEvents, ButtonSlots> {
}
export {};
