import { TimeUnit } from './enums/time-unit.js'

export class Time {
    constructor(private value: number, private unit: TimeUnit) {}

    static seconds(value: number) {
        return new Time(value, TimeUnit.SECONDS)
    }

    static minutes(value: number) {
        return new Time(value, TimeUnit.MINUTES)
    }

    toString() {
        return this.value + ' ' + this.unit.toString()
    }
}
