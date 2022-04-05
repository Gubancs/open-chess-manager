import { Player } from '../../core/model/player.js'
import { Pair } from '../model/pair.js'
import { RoundPairing } from '../model/round-pairing.js'
import { PairingSystem } from './pairing-system.js'

export class RandomSystem implements PairingSystem {
    pair(players: Player[]): RoundPairing {
        const roundPairing: RoundPairing = []

        let table = 1
        while (players.length > 1) {
            let pairing = new Pair()
            pairing.table = table
            var whiteIndex = Math.floor(Math.random() * players.length)
            pairing.white = players[whiteIndex]
            players.slice().splice(whiteIndex, 1)

            var blackIndex = Math.floor(Math.random() * players.length)
            pairing.black = players[blackIndex]
            players.slice().splice(blackIndex, 1)

            roundPairing.push(pairing)
            table++
        }

        if (players.length === 1) {
            const bye = new Pair()
            bye.allocatedBye = true
            bye.table = table
            bye.white = players[0]
            players.splice(0, 1)
            roundPairing.push(bye)
        }

        return roundPairing
    }

    initialSort(players: Player[]): Player[] {
        return players
    }
}
