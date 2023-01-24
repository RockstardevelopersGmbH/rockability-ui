import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /**
             * A unique identifier used as a post fix for the html elements used in this component.
             * @required
             */ id?: string;
        /**
             * Specifies the name of an input element. If no labelText is assigned, the name property
             * will be used to generate a label text instead.
             * @required
             */ name?: string;
        /**
             * The value of the input element.
             */ value?: string;
        /**
             * Use this property to add custom classes and stylings to the component.
             */ className?: string;
        /**
             * Define the type of the input element. Valid types are:
             * radio and checkbox
             */ type?: string;
        /**
             * Specifies that an input field must be filled out before submitting the form.
             */ required?: boolean;
        /**
             * Specifies that an input element should be disabled.
             */ disabled?: boolean;
        /**
             * Specifies that an input field is read-only.
             */ readonly?: boolean;
        /**
             * Specifies the form the input element belongs to. This is only required if the TextInput component
             * is not a child of any form element.
             */ form?: string;
        /**
             * Specifies whether the control is checked or not.
             */ checked?: boolean;
        /**
             * Specify the text for the label. The label will be automatically generated for the input field.
             * If this property won't be specified, a default name will be generated based on the input type
             * and the given name property.
             */ labelText?: string;
        /**
             * Use this property to show or hide the label of an input element. If showLabel is set to false,
             * the corresponding input element will have an aria-label element with the labelText instead.
             */ showLabel?: boolean;
        /**
             * Use this property to provide an error message for this input field in case any validation failed.
             */ errorMessage?: string;
        /**
             * Use this property to show or hide the error of an input element.
             */ showError?: boolean;
    };
    events: {
        change: Event;
        input: Event;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        label: {};
        error: {};
    };
};
export declare type BooleanInputProps = typeof __propDef.props;
export declare type BooleanInputEvents = typeof __propDef.events;
export declare type BooleanInputSlots = typeof __propDef.slots;
export default class BooleanInput extends SvelteComponentTyped<BooleanInputProps, BooleanInputEvents, BooleanInputSlots> {
}
export {};
