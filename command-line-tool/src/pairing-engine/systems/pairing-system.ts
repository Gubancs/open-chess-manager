import { Player } from '../../core/model/player.js'
import { Round } from '../../core/model/round.js'
import { RoundPairing } from '../model/round-pairing.js'

export interface PairingSystem {
    pair(players: Player[], round: Round): RoundPairing

    initialSort(players: Player[]): Player[]
}
