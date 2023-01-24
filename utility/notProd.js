export default function notProd(fn, isProduction = false) {
    if (isProduction)
        return;
    fn();
}
