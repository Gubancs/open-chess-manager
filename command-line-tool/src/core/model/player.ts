import { Country } from 'world-countries-capitals'
import { valueOfGameResult } from '../utils/utils.js'
import { FideTitle } from './enums/fide-title.js'
import { Gender } from './enums/gender.js'
import { Game } from './game.js'
import { Team } from './team.js'

export class Player {
    fideNumber?: number
    firstName: string
    lastName: string
    fideRating?: number
    fideTitle?: FideTitle
    gender: Gender
    birthDate?: Date
    country?: Country
    rank: number

    //FIXME circular reference
    games: Array<Game> = []
    team: Team
    startingRank: number

    scores(): number {
        return this.games
            .map(game => game.resultFor(this))
            .reduce((r1, r2) => r1 + valueOfGameResult(r2), 0)
    }

    getNumberOfWhiteGames() {
        return this.games.slice().filter(game => game.white === this).length
    }

    getNumberOfPlayedGames() {
        return this.getPlayedGames().length
    }

    getPlayedGames() {
        return this.games.slice().filter(g => g.isPlayed())
    }

    getNumberOfBlackGames() {
        return this.games.slice().filter(game => game.black === this).length
    }

    getGame(roundNumber: number): Game {
        return this.games
            .slice()
            .filter(game => game.roundNumber === roundNumber)[0]
    }

    getLasGame() {
        return this.games[this.games.length - 1]
    }

    hasNoByeOrForfeitWin() {
        return (
            this.games.slice().filter(g => g.isBye() || g.isForfeitWin())
                .length === 0
        )
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName
    }

    getHumanReadableName() {
        const humanReadableParts = []
        if (this.fideTitle) {
            humanReadableParts.push(this.fideTitle.toString())
        }
        humanReadableParts.push(this.getFullName())
        if (this.fideRating) {
            humanReadableParts.push('(' + this.fideRating + ')')
        }
        return humanReadableParts.join(' ')
    }
}
