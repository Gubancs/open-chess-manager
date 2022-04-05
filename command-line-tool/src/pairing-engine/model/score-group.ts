import { Player } from '../../core/model/player.js'

/**
 * A scoregroup is composed of all the players with the same score.
 */
export class ScoreGroup {
    constructor(private score: number, private players: Array<Player> = []) {}

    notContains(player: Player): boolean {
        return this.players.includes(player) === false
    }

    getScore(): number {
        return this.score
    }

    getPlayers(): Array<Player> {
        return this.players
    }

    addPlayer(player: Player) {
        this.players.push(player)
    }

    removePlayer(player: Player) {
        this.players = this.players.filter(p => p !== player)
    }
}
