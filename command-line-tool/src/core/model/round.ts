import { Game } from './game.js'

export class Round {
    isFirstRound: boolean
    isLastRound: boolean
    roundNumber: number
    games: Array<Game> = []
}
