import { Player } from '../../core/model/player.js'
import { ScoreGroup } from './score-group.js'

/**
 * A (pairing) bracket is a group of players to be paired.
 * It is composed of players coming from the same  scoregroup (called resident players) and (possibly)
 * of players coming from lower scoregroups (called upfloaters).
 *
 * Note:    Unlike other systems, there are no downfloaters in the Dubov System.
 **/
export class Bracket {
    private upfloaters: Array<Player> = []
    private upfloaterScores: number

    constructor(private scoreGroup: ScoreGroup) {}

    getScoreGroup() {
        return this.scoreGroup
    }

    getResidentPlayers() {
        return this.scoreGroup.getPlayers()
    }

    getPlayers() {
        return this.scoreGroup.getPlayers().slice().concat(this.upfloaters)
    }

    removePlayer(player: Player) {
        this.scoreGroup.removePlayer(player)
    }

    setUpfloaters(upfloaters: Array<Player>) {
        this.upfloaters = upfloaters
        this.upfloaterScores = upfloaters
            .slice()
            .reduce((total, player) => total + player.scores(), 0)
    }

    getUpfloaters(): Array<Player> {
        return this.upfloaters
    }

    getUpfloaterScores() {
        return this.upfloaterScores
    }

    getNumberOfUpfloaters(): number {
        return this.upfloaters.length
    }

    getScores() {
        return this.scoreGroup.getScore()
    }
}
