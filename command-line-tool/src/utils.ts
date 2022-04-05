export function isOdd(value: number | Array<any>): boolean {
    if (value instanceof Array) {
        return isOdd(value.length);
    } else {
        return value % 2 === 1;
    }
}

export function parseInteger(options: any, name: string, min?: number, max?: number) {
    const parsedValue = parseInt(options[name], 10);
    if (isNaN(parsedValue)) {
        throw new Error("The value of the --" + name + " option must be a valid number.");
    }
    if (min !== undefined && parsedValue < min) {
        throw new Error("The value of the --" + name + " option should be greater or equal than " + min);
    }
    if (max !== undefined && parsedValue > max) {
        throw new Error("The value of the --" + name + " option should be less or equal than " + max);
    }
    return parsedValue;
}

export function checkNumberRange(options: any, minArg: string, maxArg: string) {
    if (options[minArg] > options[maxArg]) {
        throw Error("The value of the --" + minArg + " option should be less than of --" + maxArg + " option value.");
    }
}

export function randomEnumValue(enumeration: any) {
    const values = Object.keys(enumeration);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return enumeration[enumKey];
}

export function randomItem<T>(array: Array<T> | ReadonlyArray<T>): T {
    return array[Math.floor(Math.random() * array.length)];
}
