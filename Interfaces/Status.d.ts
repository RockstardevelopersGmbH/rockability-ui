export default interface Status {
    message: string;
    type: 'info' | 'success' | 'warn' | 'error';
}
