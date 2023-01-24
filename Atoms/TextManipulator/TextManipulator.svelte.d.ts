import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /**
             * This property is required to ensure that each input element has a unqiue id to map the corresponding label to it correctly.
             * This is only required when using multiple instances of this component on a page.
             * @example
             * If you pass in 'cat', the id of the input-id input will be input-id-cat.
             * If you pass in '-cat', the id of the input-id input will be input-id--cat. Note the double dash!
             * @required
             */ id?: string;
        /**
             * Use this property to set the text on the submit button
             */ submitText?: string;
        /**
             * Use this property to set the text on the reset button
             */ resetText?: string;
        /**
             * Use this property to set the text on the cancel button
             */ cancelText?: string;
        /**
             * If this prop is set to true, the inputs will updated automatically
             * and no 'submit' or 'cancel' button will be shown.
             */ autoUpdate?: boolean;
        /**
             * Use this property to add custom classes and stylings to the component.
             */ className?: string;
        /**
             * This property sets the text for the label of the line spacing input.
             */ lineSpacingLabelText?: string;
        /**
             * This property sets the text for the label of the paragraph spacing input.
             */ paragraphSpacingLabelText?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type TextManipulatorProps = typeof __propDef.props;
export declare type TextManipulatorEvents = typeof __propDef.events;
export declare type TextManipulatorSlots = typeof __propDef.slots;
export default class TextManipulator extends SvelteComponentTyped<TextManipulatorProps, TextManipulatorEvents, TextManipulatorSlots> {
}
export {};
