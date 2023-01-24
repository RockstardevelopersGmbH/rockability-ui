import { SvelteComponentTyped } from "svelte";
import type RockabilityConfig from './RockabilityConfig';
declare const __propDef: {
    props: {
        config: RockabilityConfig;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type RockabilityProviderProps = typeof __propDef.props;
export declare type RockabilityProviderEvents = typeof __propDef.events;
export declare type RockabilityProviderSlots = typeof __propDef.slots;
export default class RockabilityProvider extends SvelteComponentTyped<RockabilityProviderProps, RockabilityProviderEvents, RockabilityProviderSlots> {
}
export {};
