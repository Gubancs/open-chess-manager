import { Player } from '../../core/model/player.js'

/**
 * two players who are to play with each other
 */
export class Pair {
    table: number
    white: Player
    black: Player
    allocatedBye: boolean
}
