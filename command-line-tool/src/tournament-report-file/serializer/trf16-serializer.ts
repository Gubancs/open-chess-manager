import { Game } from '../../core/model/game.js'
import { Player } from '../../core/model/player.js'
import { Tournament } from '../../core/model/tournament.js'

export class TRF16Serializer {
    serialize(tournament: Tournament): string {
        const lines = []

        lines.push(`012 ${tournament.name}`)
        lines.push(`022 ${this.camelize(tournament.city)}`)
        lines.push(`032 ${tournament.federation.iso.alpha_3.toUpperCase()}`)
        lines.push(`042 ${this.formatDate(tournament.dateOfStart)}`)
        lines.push(`052 ${this.formatDate(tournament.dateOfEnd)}`)
        lines.push(`062 ${tournament.getNumberOfPlayers()}`)
        lines.push(`072 ${tournament.getNumberOfRatedPlayers()}`)
        lines.push(`082 ${tournament.getNumberOfTeams()}`)
        lines.push(
            `092 ${tournament.pairingSystem} (${tournament.timeControl})`
        )
        lines.push(`102 ${tournament.chiefArbiter}`)
        lines.push(`112 ${tournament.deputyChiefArbiters.join(', ')}`)
        lines.push(`122 ${tournament.time}/${tournament.timePerMove}`)
        if (tournament.schedules.length > 0) {
            const scheduleDates = tournament.schedules
                .slice()
                .filter(s => s.scheduleType === 'round')
                .map(s => this.formatDate(s.date).substring(2))
                .join(' ')
            lines.push(`${'132'.padEnd(90)} ${scheduleDates}`)
        } else {
            lines.push('')
        }

        for (let i = 0; i < tournament.players.length; i++) {
            let player: Player = tournament.players[i]

            const playerColumns: string[] = [
                this.fixWidth('001', 3),
                this.fixWidthNumber(player.startingRank, 4),
                this.fixWidth(player.gender?.toLowerCase(), 1),
                this.fixWidth(player.fideTitle, 3),
                this.fixWidth(player.lastName + ', ' + player.firstName, 33),
                this.fixWidthNumber(player.fideRating, 4),
                this.fixWidth(player.country?.iso.alpha_3.toUpperCase(), 3),
                this.fixWidthNumber(player.fideNumber, 11),
                this.fixWidth(this.formatDate(player.birthDate), 10),
                this.fixWidthNumber(player.scores(), 4, 1),
                this.fixWidthNumber(player.rank, 4),
            ]

            let gameResults = tournament.rounds
                .slice()
                .map(round => player.getGame(round.roundNumber))
                .map(game => this.formatRoundResult(game, player))
                .join(' ')

            playerColumns.push(gameResults)

            lines.push(playerColumns.join(' '))
        }
        return lines.join('\r\n')
    }

    formatRoundResult(game: Game, player: Player): any {
        const opponent = game.opponent(player)
        const color = game.color(player)
        const result = game.resultFor(player)
        const opponentRank = opponent
            ? this.fixWidthNumber(opponent.startingRank, 4)
            : '0000'
        return `${opponentRank} ${color} ${result}`
    }

    formatDate(birthDate: Date | undefined): string {
        if (birthDate) {
            return (
                birthDate.getFullYear().toString() +
                '/' +
                (birthDate.getMonth() + 1).toString().padStart(2, '0') +
                '/' +
                birthDate.getDate().toString().padStart(2, '0')
            )
        } else {
            return ''
        }
    }

    fixWidth(text: string | undefined, width: number) {
        return (text || '').padEnd(width)
    }

    fixWidthNumber(
        value: number | undefined,
        width: number,
        fractionDigits = 0
    ): string {
        return (value !== undefined ? value.toFixed(fractionDigits) : '')
            .toString()
            .padStart(width)
    }

    camelize(str: string) {
        return str
            .split(/[ \(\)-]+/)
            .map(
                (word, index) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ')
    }
}
