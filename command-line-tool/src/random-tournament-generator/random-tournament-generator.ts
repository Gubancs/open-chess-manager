import { getAllCountryDetails } from 'world-countries-capitals'
import { TimeControl } from '../core/model/enums/time-control.js'
import { Time } from '../core/model/time.js'
import { Tournament } from '../core/model/tournament.js'
import { DubovSwissSystem } from '../pairing-engine/systems/dubov-pairing-system.js'
import { PairingSystem } from '../pairing-engine/systems/pairing-system.js'
import { randomItem, randomEnumValue } from '../utils.js'
import { RandomNameGenerator } from './dummy/dummy-name-generator.js'
import { RandomPlayerGenerator } from './dummy/dummy-player-generator.js'
import { TournamentSimulator } from './tournament-simulator.js'

export class RandomTournamentGenerator {
    dummyNames = new RandomNameGenerator()

    generate(
        rounds: number,
        players: number,
        lowestRating: number,
        highestRating: number,
        pairingSystem: PairingSystem
    ): Tournament {
        console.log('Generate tournament', {
            rounds: rounds,
            players: players,
            pairingSystem: pairingSystem,
        })

        const now = new Date()
        const today = new Date(now.toDateString())

        const tournament = new Tournament()
        tournament.name =
            'Random Generated Chess Championship ' + now.getFullYear()

        for (let r = 1; r < rounds + 1; r++) {
            const roundDate = new Date(
                today.getTime() + 1000 * 60 * 60 * 24 * r
            )
            tournament.schedules.push({
                scheduleType: 'round',
                event: `Round ${r}.`,
                date: roundDate,
            })
        }

        tournament.dateOfStart = today
        tournament.dateOfEnd = new Date(
            today.getTime() + 1000 * 60 * 60 * 24 * rounds
        )
        tournament.numberOfRounds = rounds
        tournament.federation = randomItem(getAllCountryDetails())
        tournament.chiefArbiter = this.dummyNames.maleName()
        tournament.deputyChiefArbiters = [
            this.dummyNames.femaleName(),
            this.dummyNames.maleName(),
        ]
        tournament.federation = randomItem(getAllCountryDetails())
        tournament.city = tournament.federation.capital
        tournament.timeControl = randomEnumValue(TimeControl)
        //tournament.pairingSystem = pairingSystem
        tournament.time = Time.minutes(60)
        tournament.timePerMove = Time.seconds(30)
        tournament.extraTimeAfterMoves = 40
        tournament.extraTime = Time.minutes(30)

        //Generate dummy teams
        //FIXME hard coded number of teams
        // for (let i = 0; i < 10; i++) {
        //     let team = new Team()
        //     team.name = randomItem(getAllCountryDetails()).country + " chess club"
        //     tournament.teams.push(team)
        // }

        //Generate dummy players
        const dummyPlayerGenerator = new RandomPlayerGenerator(
            lowestRating,
            highestRating
        )
        for (let i = 0; i < players; i++) {
            const player = dummyPlayerGenerator.dummyPlayer()
            tournament.addPlayer(player)

            // if (Math.random() > 0.5) {
            //     const team = randomItem(tournament.teams)
            //     player.team = team
            //     team.players.push(player)
            // }
        }

        //TODO hard coded pairing system
        const simulator = new TournamentSimulator(new DubovSwissSystem())
        return simulator.simulate(tournament)
    }
}
