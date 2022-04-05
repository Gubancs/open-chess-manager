import { GameResult } from '../core/model/enums/game-result.js'
import { Game } from '../core/model/game.js'
import { Round } from '../core/model/round.js'
import { Tournament } from '../core/model/tournament.js'
import { Pair } from './model/pair.js'
import { RoundPairing } from './model/round-pairing.js'
import { PairingSystem } from './systems/pairing-system.js'

export class PairingEngine {
    constructor(private pairingSystem: PairingSystem) {}

    pair(tournament: Tournament): Round {
        const nextRound = tournament.rounds.length + 1
        const round = new Round()
        // round.tournament = tournament;
        round.roundNumber = nextRound
        round.isFirstRound = nextRound === 1
        round.isLastRound = tournament.numberOfRounds === nextRound

        let roundPairing: RoundPairing = this.pairingSystem.pair(
            tournament.players,
            round
        )
        this.logRoundPairing(roundPairing, nextRound)
        round.games = roundPairing.map(pair =>
            this.mapPairToGame(pair, nextRound)
        )
        return round
    }

    private mapPairToGame(pairing: Pair, round: number): Game {
        const game = new Game()
        // game.round = round
        game.table = pairing.table
        game.white = pairing.white
        game.black = pairing.black
        game.roundNumber = round
        if (pairing.allocatedBye) {
            game.result = GameResult.PAIRING_ALLOCATED_BYE
        }
        //save to players
        if (game.white) {
            game.white.games.push(game)
        }
        if (game.black) {
            game.black.games.push(game)
        }
        return game
    }

    private logRoundPairing(roundPairing: RoundPairing, round: number): void {
        console.log('PairingEngine - ' + round + '. round pairings')
        let tableData = roundPairing.map(pair => {
            return {
                table: pair.table,
                white: pair.white ? pair.white.getHumanReadableName() : '-',
                ws: pair.white ? pair.white.scores() : '-',
                bs: pair.black ? pair.black.scores() : '-',
                black: pair.black ? pair.black.getHumanReadableName() : '-',
            }
        })
        console.table(tableData)
    }
}
