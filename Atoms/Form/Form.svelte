<script>/**
 * An accessible form component.
 *
 * Supported events: [on:reset, on:submit]
 *
 * Tip: When building forms it becomes more accessible when the submission has to be confirmed.
 * Make sure, the user can review the data she/he is about to submit before the acutal confirmation.
 *
 * @component
 */
import { onMount, getContext } from 'svelte';
import checkFormAccessibility from './Form.accessibility';
import notProd from '../../utility/notProd';
/**
 * A unique identifier used as a post fix for the html elements used in this component.
 * @required
 */
export let id = '';
/**
 * Specifies the name of an input element. If no labelText is assigned, the name property
 * will be used to generate a label text instead.
 * @required
 */
export let name = '';
/**
 * Use this property to add custom classes and stylings to the component.
 */
export let className = '';
/**
 * Space-separated character encodings the server accepts. The browser uses them in the order in which they are listed.
 */
export let acceptCharset = '';
/**
 * Specifies whether the form element should have autocomplete enabled.
 */
export let autocomplete = 'on';
/**
 * Creates a hyperlink or annotation depending on the value.
 */
export let rel = '';
/**
 * The URL that processes the form submission.
 */
export let action = '';
/**
 * If the value of the method attribute is post, enctype is the MIME type of the form submission.
 */
export let enctype = '';
/**
 * The HTTP method to submit the form with.
 * Valid values are: ['post', 'get', 'dialog']
 */
export let method = '';
/**
 * This Boolean attribute indicates that the form shouldn'v be validatd when submitted.
 */
export let novalidate = false;
/**
 * Indicates where to display the response after submitting the form.
 * Valid values are: ['_self', '_blank', '_parent', '_top']
 */
export let target = '';
/**
 * This property displays a status message at the top of the form.
 * The aria-role equals 'status' and therefore, users with scree-readers will get notified when the status gets updated.
 *
 * This property expects the following data structure: {message: string; type: 'info' | 'success' | 'warn' | 'error';}
 *
 */
export let status = null;
/**
 * Use this property to change the text used for the title attribute used on the control to close a status.
 */
export let statusCloseAriaLabel = 'Close';
let component;
const validMethods = ['post', 'get', 'dialog'];
const validTargets = ['_self', '_blank', '_parent', '_top'];
const config = getContext('rockabilityConfig');
let isProduction;
const prefix = 'form';
onMount(async () => {
    if (!config) {
        console.warn('No configuration was provided. Please use the RockabilityProvider component to setup the library.');
    }
    isProduction = config && config.isProduction ? config.isProduction : null;
    notProd(() => checkForValidMethods, isProduction);
    notProd(() => checkForValidTargets, isProduction);
    notProd(() => checkRequiredProps, isProduction);
    notProd(() => checkFormAccessibility(component, statusCloseAriaLabel, autocomplete), isProduction);
});
function checkForValidMethods() {
    if (!method || validMethods.includes(method))
        return;
    console.error(`The method '${method}' is not valid for Form. Valid methods are [${validMethods}]`, component);
}
function checkForValidTargets() {
    if (!target || validTargets.includes(target))
        return;
    console.error(`The target '${target}' is not valid for Form. Valid targets are [${validTargets}]`, component);
}
function checkRequiredProps() {
    if (!name)
        console.error('A name for the Form component is required.', component);
    if (!id)
        console.error('An id for the Form component is required.', component);
}
function onStatusClose() {
    status = null;
}
</script>

<form
	bind:this={component}
	class={className || ''}
	id={`${prefix}-${id}`}
	{name}
	acceptCharset={acceptCharset || null}
	autocomplete={autocomplete || null}
	rel={rel || null}
	action={action || null}
	enctype={enctype || null}
	method={method || null}
	novalidate={novalidate || null}
	target={target || null}
	on:submit
	on:reset
>
	{#if status && status.message && status.type}
		<div role={status.type === 'error' ? 'alert' : 'status'} class="status {status.type}">
			<div class="message">
				{status.message}
			</div>
			<div class="close-status" on:click={onStatusClose}>
				<div class="close-icon" aria-label={statusCloseAriaLabel}>+</div>
			</div>
		</div>
	{/if}
	<slot />
</form>

<style>form {
  background-color: var(--bg-color);
  color: var(--font-color);
}

.status {
  padding: var(--alert-padding);
  border-radius: var(--alert-border-radius);
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
}

.close-status {
  padding: 4px;
  align-self: flex-start;
  margin-left: auto;
  cursor: pointer;
}

.close-icon {
  font-size: 1.4em;
  line-height: 0.7em;
  transform: rotate(-45deg);
}

.message {
  margin-right: 10px;
}

.info {
  color: var(--info-color);
  background-color: var(--info-bg);
  border: var(--info-border);
  border-color: var(--info-border-color);
}

.success {
  color: var(--success-color);
  background-color: var(--success-bg);
  border: var(--success-border);
  border-color: var(--success-border-color);
}

.warn {
  color: var(--warn-color);
  background-color: var(--warn-bg);
  border: var(--warn-border);
  border-color: var(--warn-border-color);
}

.error {
  color: var(--error-color);
  background-color: var(--error-bg);
  border: var(--error-border);
  border-color: var(--error-border-color);
}</style>
