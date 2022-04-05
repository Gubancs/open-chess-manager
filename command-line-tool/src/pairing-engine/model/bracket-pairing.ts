import { Bracket } from './bracket.js'
import { Pair } from './pair.js'
import { Pairing } from './pairing.js'

/**
 * the set of pairs for a Pairing bracket or for a complete round
 */
export class BracketPairing {
    constructor(private bracket: Bracket, private pairing: Pairing = []) {}
    getBracket(): Bracket {
        return this.bracket
    }
    getPairing(): Pairing {
        return this.pairing
    }
    addPair(pair: Pair) {
        this.pairing.push(pair)
    }
    removePair(pair: Pair) {
        this.pairing = this.pairing.filter(p => p !== pair)
    }
    getNumberOfPairs() {
        return this.pairing.length
    }
    copy() {
        return new BracketPairing(this.bracket, this.pairing.slice())
    }
}
