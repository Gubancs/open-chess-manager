import { GameResult } from '../core/model/enums/game-result.js'
import { Game } from '../core/model/game.js'
import { Player } from '../core/model/player.js'
import { Round } from '../core/model/round.js'
import { Tournament } from '../core/model/tournament.js'
import { PairingEngine } from '../pairing-engine/pairing-engine.js'
import { PairingSystem } from '../pairing-engine/systems/pairing-system.js'
import { randomItem } from '../utils.js'

export class TournamentSimulator {
    private pairingEngine: PairingEngine

    constructor(private pairingSystem: PairingSystem) {
        this.pairingEngine = new PairingEngine(pairingSystem)
    }

    simulate(tournament: Tournament) {
        console.log('TournamentSimulator - Starting tournament simulation.')
        console.log(
            'TournamentSimulator - Using pairing system: ',
            this.pairingSystem
        )
        tournament.players = this.pairingSystem.initialSort(tournament.players)
        this.logInitialRankingList(tournament.players)
        while (tournament.rounds.length < tournament.numberOfRounds) {
            const round: Round = this.pairingEngine.pair(tournament)
            tournament.rounds.push(round)

            this.simulateRound(round)

            this.logRoundResults(round.games, round.roundNumber)

            tournament.players = tournament.players.sort(
                (p1, p2) => p2.scores() - p1.scores()
            )
        }

        console.log('Tournament simulation finished.')
        return tournament
    }

    simulateRound(round: Round) {
        round.games.forEach(game => {
            if (!game.result) {
                //TODO simulate friendly results?
                var whiteRating = game.white.fideRating || 0
                var blackRating = game.black.fideRating || 0

                if (Math.random() < 0.05) {
                    game.result = randomItem([
                        GameResult.FORFEIT_WIN,
                        GameResult.FORFEIT_LOSS,
                    ])
                } else if (
                    Math.abs(whiteRating - blackRating) < 100 &&
                    Math.random() < 0.8
                ) {
                    game.result = GameResult.DRAW
                } else if (
                    whiteRating > blackRating &&
                    Math.random() < ((whiteRating - blackRating) * 0.1) / 100
                ) {
                    game.result = GameResult.WIN
                } else if (
                    blackRating > whiteRating &&
                    Math.random() < ((blackRating - whiteRating) * 0.1) / 100
                ) {
                    game.result = GameResult.LOSS
                } else {
                    game.result = randomItem([
                        GameResult.WIN,
                        GameResult.LOSS,
                        GameResult.DRAW,
                    ])
                }
            }
        })
    }

    logInitialRankingList(players: Player[]) {
        console.debug('TournamentSimulator - Initial ranking list')
        let tableData = players.map(player => {
            return {
                rank: player.startingRank,
                title: player.fideTitle || '-',
                name: player.getFullName(),
                rating: player.fideRating || '-',
            }
        })
        console.table(tableData)
    }

    logRoundResults(games: Game[], round: number) {
        console.log('TournamentSimulator - ' + round + '. round results')
        let tableData = games.map(game => {
            return {
                table: game.table,
                white: game.white ? game.white.getHumanReadableName() : '-',
                black: game.black ? game.black.getHumanReadableName() : '-',
                result: game.result,
            }
        })
        console.table(tableData)
    }
}
