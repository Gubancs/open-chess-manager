export class PairingQuality {
    // number of the acceptable pairs
    acceptablePairs: number

    // the number of upfloaters
    upfloaters: number

    // the total scores of upfloaters
    totalUpfloaterScores: number

    // players who do not get their colour preference.
    wrongColors: number

    // number of upfloaters who are maximum upfloaters
    maximumUpfloaters: number

    // the number of times a maximum upfloater is upfloated.
    maximumUpfloatersTimes: number

    // the number of upfloaters who upfloated in the previous round.
    numberOfPreviousUpfloaters: number

    /**
     * Compare it to the given PairingQuality
     *
     * @param q2
     * @returns return a positive value if this is better than the given PairingQualiity,
     *  zero if they're equal and a negative value otherwise.
     */
    compareTo(q2: PairingQuality): number {
        return (
            this.acceptablePairs - q2.acceptablePairs || //maximize the number of the acceptable pairs
            (this.upfloaters - q2.upfloaters) * -1 || //	C.5	minimize the number of upfloaters.
            this.totalUpfloaterScores - q2.totalUpfloaterScores || // C.6	minimize the score differences in the pairs involving upfloaters,
            (this.wrongColors - q2.wrongColors) * -1 || // C.7	minimize the number of players who do not get their colour preference.
            (this.maximumUpfloaters - q2.maximumUpfloaters) * -1 || // 	C.8	minimize the number of upfloaters  who are maximum upfloaters (see A.7).
            (this.maximumUpfloatersTimes - q2.maximumUpfloatersTimes) * -1 || //C.9 minimize the number of times a maximum upfloater is upfloated.
            (this.numberOfPreviousUpfloaters - q2.numberOfPreviousUpfloaters) *
                -1 // C.10	 minimize the number of upfloaters who upfloated in the previous round.
        )
    }

    isBetterThan(q2: PairingQuality): boolean {
        return this.compareTo(q2) > 0
    }

    isWorseThan(q2: PairingQuality): boolean {
        return this.compareTo(q2) < 0
    }
}
