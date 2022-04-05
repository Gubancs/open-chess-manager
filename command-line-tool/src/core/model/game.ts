import { negateGameResult } from '../utils/utils.js'
import { Color } from './enums/color.js'
import { GameResult } from './enums/game-result.js'
import { Player } from './player.js'

export class Game {
    table: number

    //FIXME circular reference
    white: Player

    //FIXME circular reference
    black: Player
    result: GameResult

    roundNumber: number

    // round: Round;

    opponent(player: Player): Player | undefined {
        if (this.white === player) {
            return this.black
        } else if (this.black === player) {
            return this.white
        }
    }

    color(player: Player): Color {
        return this.white === player ? Color.WHITE : Color.BLACK
    }

    resultFor(player: Player) {
        return this.white === player
            ? this.result
            : negateGameResult(this.result)
    }

    isBye() {
        return (
            this.result === GameResult.ZERO_POINT_BYE ||
            this.result === GameResult.FULL_POINT_BYE ||
            this.result === GameResult.HALF_POINT_BYE ||
            this.result === GameResult.PAIRING_ALLOCATED_BYE
        )
    }

    isForfeitWin() {
        return this.result === GameResult.FORFEIT_WIN
    }

    isPlayed() {
        return (
            this.result === GameResult.DRAW ||
            this.result === GameResult.WIN ||
            this.result === GameResult.LOSS ||
            this.result === GameResult.FRIENDLY_LOSS ||
            this.result === GameResult.FRIENDLY_DRAW ||
            this.result === GameResult.FRIENDLY_WIN
        )
    }
}
