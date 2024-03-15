export function currencyFormat(value: number) {
    if (typeof value !== "number") {
        return;
    }
    return "£" + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function deepEquals(object1: any, object2: any) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            (areObjects && !deepEquals(val1, val2)) ||
            (!areObjects && val1 !== val2)
        ) {
            alert("hmm");
            return false;
        }
    }
}

function isObject(object: Object) {
    return object != null && typeof object === "object";
}
