import { SvelteComponentTyped } from "svelte";
import type Status from '../../Interfaces/Status';
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
             * Space-separated character encodings the server accepts. The browser uses them in the order in which they are listed.
             */ acceptCharset?: string;
        /**
             * Specifies whether the form element should have autocomplete enabled.
             */ autocomplete?: string;
        /**
             * Creates a hyperlink or annotation depending on the value.
             */ rel?: string;
        /**
             * The URL that processes the form submission.
             */ action?: string;
        /**
             * If the value of the method attribute is post, enctype is the MIME type of the form submission.
             */ enctype?: string;
        /**
             * The HTTP method to submit the form with.
             * Valid values are: ['post', 'get', 'dialog']
             */ method?: string;
        /**
             * This Boolean attribute indicates that the form shouldn'v be validatd when submitted.
             */ novalidate?: boolean;
        /**
             * Indicates where to display the response after submitting the form.
             * Valid values are: ['_self', '_blank', '_parent', '_top']
             */ target?: string;
        /**
             * This property displays a status message at the top of the form.
             * The aria-role equals 'status' and therefore, users with scree-readers will get notified when the status gets updated.
             *
             * This property expects the following data structure: {message: string; type: 'info' | 'success' | 'warn' | 'error';}
             *
             */ status?: Status;
        /**
             * Use this property to change the text used for the title attribute used on the control to close a status.
             */ statusCloseAriaLabel?: string;
    };
    events: {
        submit: SubmitEvent;
        reset: Event;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type FormProps = typeof __propDef.props;
export declare type FormEvents = typeof __propDef.events;
export declare type FormSlots = typeof __propDef.slots;
export default class Form extends SvelteComponentTyped<FormProps, FormEvents, FormSlots> {
}
export {};
