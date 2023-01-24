import { writable } from 'svelte/store';
// LineHeight
const storedLineSpacing = getLineHeight();
export const lineSpacing = writable(storedLineSpacing);
lineSpacing.subscribe((value) => {
    if (typeof window !== 'undefined')
        localStorage.setItem('--user-line-height', value);
});
function getLineHeight() {
    if (typeof window !== 'undefined')
        return localStorage.getItem('--user-line-height');
}
// ParagraphSpacing
const storedParagraphSpacing = getParagraphSpacing();
export const paragraphSpacing = writable(storedParagraphSpacing);
paragraphSpacing.subscribe((value) => {
    if (typeof window !== 'undefined')
        localStorage.setItem('--user-paragraph-spacing', value);
});
function getParagraphSpacing() {
    if (typeof window !== 'undefined')
        return localStorage.getItem('--user-paragraph-spacing');
}
