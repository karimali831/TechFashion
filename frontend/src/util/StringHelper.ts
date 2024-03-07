export function currencyFormat(value: number) {
    if (typeof value !== "number") {
        return;
    }
    return "£" + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
