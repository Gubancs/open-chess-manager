import { Player } from '../../core/model/player.js'

/**
 * Each possible upfloater receives a sequence number,
 * according to their score and, when scores are equal, to their initial ranking.
 */
export class Upfloater {
    private scores: number
    constructor(private sequenceNumber: number, private player: Player) {
        this.scores = player.scores()
    }

    asPlayer() {
        return this.player
    }

    getSequenceNumber() {
        return this.sequenceNumber
    }

    getScores() {
        return this.scores
    }
}
