import { SvelteComponentTyped } from "svelte";
import type Option from '../../Interfaces/Option';
declare const __propDef: {
    props: {
        /**
             * The options are passed in as an array of options.
             *
             * The Option object must look like this:
             * Option { value: string, displayName: string, selected: boolean, disabled: boolean }
             * @required
             */ options?: Array<Option>;
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
             * Specifies a short hint that describes the expected value of an input element.
             */ placeholder?: string;
        /**
             * Use this property to add custom classes and stylings to the component.
             */ className?: string;
        /**
             * Specifies that an input field must be filled out before submitting the form.
             */ required?: boolean;
        /**
             * Specifies that an input element should be disabled.
             */ disabled?: boolean;
        /**
             * Specifies whether the input element should have autocomplete enabled.
             */ autocomplete?: string;
        /**
             * Specifies the form the input element belongs to. This is only required if the component
             * is not a child of any form element.
             */ form?: string;
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
             * Use this property to specify if the label should be rendered before the input element or after the input element.
             * This property might come in handy for proper positioning of the label and input fields.
             * If positionLabelAfter equals true, first the input element is rendered, then the label element.
             */ positionLabelAfter?: boolean;
        /**
             * Use this property to provide an error message for this input field in case any validation failed.
             */ errorMessage?: string;
        /**
             * Use this property to show or hide the error of an input element.
             */ showError?: boolean;
        /**
             * Use this property to set the initial value to an empty string.
             */ initEmpty?: boolean;
    };
    events: {
        rChange: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        label: {};
        error: {};
    };
};
export declare type CustomSelectInputProps = typeof __propDef.props;
export declare type CustomSelectInputEvents = typeof __propDef.events;
export declare type CustomSelectInputSlots = typeof __propDef.slots;
export default class CustomSelectInput extends SvelteComponentTyped<CustomSelectInputProps, CustomSelectInputEvents, CustomSelectInputSlots> {
}
export {};
