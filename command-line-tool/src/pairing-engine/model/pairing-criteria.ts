import { ColorUtils } from '../utils/color-utils.js'
import { Pair } from './pair.js'

/**
 * In Swiss pairing systems, a rule to determine which players can be paired or float;
 * absolute ~: a pairing criterion that must always be complied with (see C.1-C.3);
 * completion ~: see Completion criterion;
 * relative ~: a pairing criterion that improves the quality of the pairings
 * but does not determine their acceptability
 *
 */
export interface AbsolutePairingCriteria {
    evaluate(pairing: Pair): boolean
}

/**
 * Two players shall not play against each other more than once.
 */
export class UniquePairingCriteria implements AbsolutePairingCriteria {
    /**
     * Returns true if the players not played each other yet
     */
    evaluate(pairing: Pair): boolean {
        const whiteP = pairing.white
        const blackP = pairing.black

        return (
            whiteP.games.slice().filter(g => g.opponent(whiteP) === blackP)
                .length === 0
        )
    }
}

/**
 * A player who has already received a pairing-allocated bye,
 * or has already scored a (forfeit) win due to an opponent not appearing in time,
 * shall not receive the pairing-allocated bye
 */
export class SingleAllocatedByeCriteria implements AbsolutePairingCriteria {
    evaluate(pairing: Pair): boolean {
        if (pairing.allocatedBye) {
            const player = pairing.white || pairing.black
            return player.hasNoByeOrForfeitWin()
        } else {
            return true
        }
    }
}

/**
 * two players with the same absolute Color preference (see A.5.a)
 * shall not meet (see C.04.1.f and C.04.1.g).
 */
export class AbsoluteColorPreferenceCriteria
    implements AbsolutePairingCriteria
{
    colorUtils = new ColorUtils()

    /**
     * Returns true if the color preferences of white and black players are different
     */
    evaluate(pairing: Pair): boolean {
        if (
            this.colorUtils.hasAbsoluteColorPreference(pairing.white) &&
            this.colorUtils.hasAbsoluteColorPreference(pairing.black)
        ) {
            const whiteDueColor = this.colorUtils.dueColor(pairing.white)
            const blackDueColor = this.colorUtils.dueColor(pairing.black)
            return whiteDueColor !== blackDueColor
        } else {
            return true
        }
    }
}
