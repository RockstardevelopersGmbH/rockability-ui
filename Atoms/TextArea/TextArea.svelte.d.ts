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
             * Use this property to add custom classes and stylings to the component.
             */ className?: string;
        /**
             * The value of the \<textarea\> element.
             */ value?: string;
        /**
             * Specifies that an \<textarea\> field must be filled out before submitting the form.
             */ required?: boolean;
        /**
             * Specifies that an \<textarea\> element should be disabled.
             */ disabled?: boolean;
        /**
             * Specifies whether the \<textarea\> element should have autocomplete enabled.
             */ autocomplete?: string;
        /**
             * Specifies the form the input element belongs to. This is only required if the component
             * is not a child of any form element.
             */ form?: string;
        /**
             * The visible width of the text control, in average character widths.
             */ cols: number;
        /**
             * The number of visible text lines for the control.
             */ rows: number;
        /**
             * The maximum number of characters (UTF-16 code units) that the user can enter.
             * If this value isn't specified, the user can enter an unlimited number of characters.
             */ maxlength: number;
        /**
             * The minimum number of characters (UTF-16 code units) required that the user should enter.
             */ minlength: number;
        /**
             * This Boolean attribute indicates that the user cannot modify the value of the control.
             */ readonly: boolean;
        /**
             * A hint to the user of what can be entered in the control.
             */ placeholder: string;
        /**
             * Specifies whether the \<textarea\> is subject to spell checking by the underlying browser/OS.
             */ spellcheck?: boolean;
        /**
             * Indicates how the control wraps text. Possible values are [hard, soft, off]
             */ wrap?: string;
        /**
             * Use this property to set the value of the css resize property on the
             * \<textarea\> element.
             */ resize?: string;
        /**
             * Specify the text for the label. The label will be automatically generated for the \<textarea\> field.
             * If this property won't be specified, a default name will be generated based the given name property.
             */ labelText?: string;
        /**
             * Use this property to show or hide the label of an input element. If showLabel is set to false,
             * the corresponding input element will have an aria-label element with the labelText instead.
             */ showLabel?: boolean;
        /**
             * Use this property to specify if the label should be rendered before the input element or after the \<textarea\> element.
             * This property might come in handy for proper positioning of the label and \<textarea\> field.
             * If positionLabelAfter equals true, first the \<textarea\> element is rendered, then the label element.
             */ positionLabelAfter?: boolean;
        /**
             * Use this property to provide an error message for this \<textarea\> field in case any validation failed.
             */ errorMessage?: string;
        /**
             * Use this property to show or hide the error of an \<textarea\> element.
             */ showError?: boolean;
    };
    events: {
        input: Event;
        blur: FocusEvent;
        focus: FocusEvent;
        change: Event;
        select: Event;
        selectionchange: Event;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        label: {};
        error: {};
    };
};
export declare type TextAreaProps = typeof __propDef.props;
export declare type TextAreaEvents = typeof __propDef.events;
export declare type TextAreaSlots = typeof __propDef.slots;
export default class TextArea extends SvelteComponentTyped<TextAreaProps, TextAreaEvents, TextAreaSlots> {
}
export {};
