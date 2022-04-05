import { Player } from '../../core/model/player.js'
import { UpfloaterSet } from './upfloater-set.js'

/**
 * set of upfloaters may be formed of players with different scores
 * the possible sets are subdivided in containers
 */
export class UpfloaterContainer extends Array<UpfloaterSet> {
    constructor(private scores: number = 0) {
        super()
    }
    getScores(): number {
        return this.scores
    }

    getPlayers(): Player[] {
        const players: Player[] = []
        this.forEach(upfloaterSet =>
            upfloaterSet.forEach(uploater => {
                players.push(uploater.asPlayer())
            })
        )
        return players
    }
}
