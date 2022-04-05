import { Country } from 'world-countries-capitals'
import { PairingSystem } from './enums/pairing-system.js'
import { TimeControl } from './enums/time-control.js'
import { Player } from './player.js'
import { Round } from './round.js'
import { Schedule } from './schedule.js'
import { Team } from './team.js'
import { Time } from './time.js'

export class Tournament {
    pairingSystem: PairingSystem
    city: string
    federation: Country
    name: string
    dateOfStart: Date
    dateOfEnd: Date
    timeControl: TimeControl
    teams: Array<Team> = []
    time: Time
    timePerMove?: Time
    extraTime?: Time
    extraTimeAfterMoves?: number
    numberOfRounds: number
    rounds: Array<Round> = []
    players = new Array<Player>()
    chiefArbiter: string
    deputyChiefArbiters: string[] = []
    schedules: Array<Schedule> = []

    addPlayer(player: Player): void {
        this.players.push(player)
    }

    getNumberOfPlayers(): number {
        return this.players.length
    }

    getNumberOfRatedPlayers(): number {
        return this.players.filter(
            player => player.fideRating && player.fideRating > 0
        ).length
    }

    getNumberOfTeams(): number {
        return this.teams.length
    }
}
