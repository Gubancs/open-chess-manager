import combinations from 'combinations'
import { Color } from '../../core/model/enums/color.js'
import { FideTitle } from '../../core/model/enums/fide-title.js'
import { Player } from '../../core/model/player.js'
import { Round } from '../../core/model/round.js'
import { HashMap } from '../../core/structures/hashmap.js'
import { isOdd } from '../../utils.js'
import { BracketPairing } from '../model/bracket-pairing.js'
import { Bracket } from '../model/bracket.js'
import { Pair } from '../model/pair.js'
import {
    UniquePairingCriteria,
    SingleAllocatedByeCriteria,
    AbsoluteColorPreferenceCriteria,
} from '../model/pairing-criteria.js'
import { PairingQuality } from '../model/pairing-quality.js'
import { Pairing } from '../model/pairing.js'
import { RoundPairing } from '../model/round-pairing.js'
import { ScoreGroup } from '../model/score-group.js'
import { UpfloaterContainer } from '../model/upfloater-container.js'
import { UpfloaterSet } from '../model/upfloater-set.js'
import { Upfloater } from '../model/upfloater.js'
import { ColorUtils } from '../utils/color-utils.js'
import { PairingSystem } from './pairing-system.js'

/**
 * The Dubov Swiss Pairing System is designed to maximise the fair treatment of the players.
 * This means that a player having more points than another player during a tournament
 * should have a higher performance rating as well.
 *
 * If the average rating of all players is nearly equal, like in a round robin tournament,
 * the goal is reached. As a Swiss System is a statistical system,
 * this goal can only be reached approximately. The approach is the attempt to equalise
 * the average rating of the opponents (ARO, see A.6) of all players of a scoregroup.
 *
 * Therefore, the pairing of a round will now pair players who have a low
 * ARO against opponents having high ratings.
 */
export class DubovSwissSystem implements PairingSystem {
    // C.1 see C.04.1.b (Two players shall not play against each other more than once)
    uniquePairingCriteria = new UniquePairingCriteria()

    // C.2 see C.04.1.d (A player who has already received a pairing-allocated bye,
    // or has already scored a (forfeit) win due to an opponent not appearing in time,
    // shall not receive the pairing-allocated bye).
    singleAllocatedByeCriteria = new SingleAllocatedByeCriteria()

    //	C.3 two players with the same absolute colour preference (see A.5.a) shall not meet (see C.04.1.f and C.04.1.g).
    colorPreferenceCriteria = new AbsoluteColorPreferenceCriteria()

    colorUtils = new ColorUtils()
    upfloaters: Map<Round, Player[]> = new Map()

    /**
     * The pairing of a round (called round-pairing)
     * is complete if all the players (except at most one, who
     * receives the pairing-allocated bye) have been paired and the
     * absolute criteria C1-C3 have been complied with.
     */
    pair(players: Array<Player>, round: Round): RoundPairing {
        players = this.reSortTheInitialRanking(players, round)

        let roundParing: RoundPairing = []

        const listOfPlayers = players.slice()
        //B.0 Pairing-Allocated-Bye assignment
        if (isOdd(players)) {
            //The pairing process starts with the assignment of the pairing-allocated-bye
            const bye = this.pairingAllocatedByeAssignment(players)
            roundParing.push(bye)

            //remove bye player
            const byePlayer = bye.white || bye.black
            console.log('DubovSwissSystem - pairing allocated by is: ', {
                bye: byePlayer,
            })
            listOfPlayers.splice(listOfPlayers.indexOf(byePlayer), 1)
        }

        //Pairing for the first round
        if (round.isFirstRound) {
            roundParing = this.pairFirstRound(listOfPlayers).concat(roundParing)
        }
        //The standard pairing procedure for the remaining rounds.
        else {
            roundParing = this.pairNextRound(listOfPlayers, round).concat(
                roundParing
            )
        }
        return roundParing
    }

    /**
     *  A.2 Initial ranking list
     *  Before the first round the players are ranked in order of, respectively
     *  [a] Strength (rating)
     *  [b] FIDE-title (GM-IM-WGM-FM-WIM-CM-WFM-WCM-no title)
     *  [c] alphabetically
     */
    initialSort(players: Player[]): Player[] {
        players = players.sort((p1, p2) => {
            const p1Rating = p1.fideRating || 0
            const p2Rating = p2.fideRating || 0
            const p1TitleValue = p1.fideTitle
                ? Object.keys(FideTitle).indexOf(p1.fideTitle)
                : 0
            const p2TitleValue = p2.fideTitle
                ? Object.keys(FideTitle).indexOf(p2.fideTitle)
                : 0

            return (
                p2Rating - p1Rating ||
                p2TitleValue - p1TitleValue ||
                p1.firstName.localeCompare(p2.firstName)
            )
        })

        //reassigne startingRanks
        players = players.map(player => {
            player.startingRank = players.indexOf(player) + 1
            return player
        })
        return players
    }

    /**
     * The standard pairing procedure for the remaining rounds.
     *
     * @param players
     */
    pairNextRound(players: Player[], round: Round): Pairing {
        let pairing: Pairing = []

        const scoreGroups: ScoreGroup[] = this.createScoreGroups(players)
        const brackets = this.createPairingBrackets(scoreGroups)

        let upfloatersInThisRound: Player[] = []
        for (let bracket of brackets) {
            const score = bracket.getScoreGroup().getScore()

            //removes the upfloated players whose upfloated to a highest bracket
            upfloatersInThisRound.forEach(upfloater =>
                bracket.removePlayer(upfloater)
            )

            console.log('DubovSwissSystem - bracket: ', { scoreGroup: score })
            const scoreGroupsTableData = bracket
                .getPlayers()
                .map(player => player.getHumanReadableName())
            console.table(scoreGroupsTableData)

            //B.1	Determine the minimum number of upfloaters needed to obtain a legal pairing
            const minimumUpfloaters = this.determineUpfloatersNeeded(bracket)

            //Collect the possible upfloaters according to the group scores
            const possibleUpfloaters: Array<Upfloater> =
                this.getPossibleUpfloaters(players, score)

            //prepare upfloater sets subdivied in containers
            const upfloaterContainers = this.prepareUpfloaterContainers(
                possibleUpfloaters,
                minimumUpfloaters
            )

            //B.2 Choose the first set of upfloaters
            let bestBracketPairing: BracketPairing | null = null
            for (let upfloaderContainer of upfloaterContainers) {
                const bracketPairing = this.obtainBestPairing(
                    bracket,
                    upfloaderContainer,
                    round
                )
                if (bestBracketPairing) {
                    bestBracketPairing = this.chooseBestPairing(
                        [bestBracketPairing, bracketPairing],
                        round
                    )
                } else {
                    bestBracketPairing = bracketPairing
                }
            }

            if (bestBracketPairing) {
                console.log(
                    'DubovSwissSystem - best bracket pairing is: ',
                    bestBracketPairing
                )
                pairing = pairing.concat(bestBracketPairing.getPairing())
                upfloatersInThisRound = upfloatersInThisRound.concat(
                    bracket.getUpfloaters()
                )
            } else {
                throw (
                    'Unable to create pairing for bracket: ' +
                    bracket.getScores()
                )
            }
        }

        return pairing
    }

    obtainBestPairing(
        bracket: Bracket,
        upfloaterContainer: UpfloaterContainer,
        round: Round
    ): BracketPairing {
        bracket.setUpfloaters(upfloaterContainer.getPlayers())

        let backtracking = (
            players: Array<Player>,
            bracketPairing: BracketPairing
        ): BracketPairing => {
            const pairingQuality = this.getQualityOfBracketPairing(
                bracketPairing,
                round
            )
            //we successfully paired all players
            if (players.length === 0) {
                return bracketPairing
            }
            let remainingPlayers = players.slice()

            let pair = new Pair()
            pair.black = remainingPlayers.shift()!
            for (let whitePlayer of remainingPlayers) {
                pair.white = whitePlayer
                if (this.isAcceptablePair(pair)) {
                    remainingPlayers.shift()
                    let nextPairing = bracketPairing.copy()
                    nextPairing.addPair(pair)
                    const childPairing = backtracking(
                        remainingPlayers,
                        nextPairing
                    )
                    const childPairingQuality = this.getQualityOfBracketPairing(
                        childPairing,
                        round
                    )

                    if (childPairingQuality.isBetterThan(pairingQuality)) {
                        bracketPairing = childPairing
                    }
                }
            }
            return bracketPairing
        }

        const bestPairing = backtracking(
            bracket.getPlayers(),
            new BracketPairing(bracket)
        )
        // const pairingQuality = this.getQualityOfBracketPairing(
        //     bestPairing,
        //     round
        // )
        return bestPairing
    }

    private prepareUpfloaterContainers(
        upfloaters: Array<Upfloater>,
        minimumUpfloaters: number
    ): Array<UpfloaterContainer> {
        if (minimumUpfloaters === 0) {
            return [new UpfloaterContainer()]
        } else if (minimumUpfloaters === 1) {
            return upfloaters.slice().map(upfloater => {
                let upfloaterSet = new UpfloaterContainer(upfloater.getScores())
                upfloaterSet.push(new UpfloaterSet(upfloater))
                return upfloaterSet
            })
        } else {
            //prepare the combinations of the possible upfloaters
            const upfloaterSets = combinations(
                upfloaters,
                minimumUpfloaters,
                minimumUpfloaters
            ).map(upfloaters => {
                //FIXME scores must be the sum of the all upfloaters scores
                let upfloaterSet = new UpfloaterContainer(
                    upfloaters[0].getScores()
                )
                upfloaterSet.push(upfloaters)
                return upfloaterSet
            })
            return upfloaterSets
        }
    }

    /**
     * Creates pairing brackets from the given score groups
     *
     * A (pairing) bracket is a group of players to be paired.
     * It is composed of players coming from the same  scoregroup (called resident players)
     * and (possibly) of players coming from lower scoregroups (called upfloaters).
     * @param players
     * @returns
     */
    private createPairingBrackets(
        scoreGroups: Array<ScoreGroup>
    ): Array<Bracket> {
        // A (pairing) bracket is a group of players to be paired.
        // It is composed of players coming from the same  scoregroup (called resident players)
        // and (possibly) of players coming from lower scoregroups (called upfloaters).
        return scoreGroups.map(scoreGroup => new Bracket(scoreGroup))
    }

    /**
     * Possibly players coming from lower scoregroups (called upfloaters)
     * Each possible upfloater receives a sequence number,
     * according to their score and, when scores are equal, to their initial ranking.
     *
     * @param players the list of players in the tournament
     * @param maximumScore the upfloaters scores will be less than the maximumScore
     *
     * @returns return the list of the possibly upfloaters
     */
    private getPossibleUpfloaters(
        players: Array<Player>,
        maximumScore: number
    ): Array<Upfloater> {
        let possibleUfloaters = players
            .slice()
            //filter by lower score
            .filter(player => player.scores() < maximumScore)
            //sort by their scores descending
            .sort(
                (player1, player2) =>
                    player2.scores() - player1.scores() ||
                    //sort tby initial ranking ascending when scores are equal
                    player1.startingRank - player2.startingRank
            )

            //convert Player to Upfloater type
            .map((player, index) => new Upfloater(index + 1, player))

        console.log('DubovSwissSystem - number of possible upfloaters: ', {
            possibleUfloaters: possibleUfloaters,
        })
        return possibleUfloaters
    }

    private reSortTheInitialRanking(
        players: Player[],
        round: Round
    ): Array<Player> {
        //. The pairing numbers may be reassigned accordingly to the
        // corrections, but only for the first three rounds.
        if (round.roundNumber <= 3) {
            players = this.initialSort(players)
        }
        return players
    }

    /**
     * Determine the minimum number of upfloaters needed to obtain a legal pairing
     * of all the (remaining) resident players of the scoregroup.
     *
     * Note: A pairing is legal when the criteria C.1, C.3 and C.4 are complied with.
     *
     * @param pairingBracket
     * @returns Return the number upfloaters needed to obtain a legal pairing in the given pairing bracket
     */
    private determineUpfloatersNeeded(pairingBracket: Bracket): number {
        const allPlayers = pairingBracket.getResidentPlayers()
        const maxPossiblePairings = Math.floor(allPlayers.length / 2)

        const countAcceptablePairs = (
            players: Player[],
            legalPairings = 0
        ): number => {
            //in this case we cannot create legal pairing
            if (players.length < 2) {
                return 0
            }
            let remainingPlayers = players.slice() //it copies the players list
            let pair = new Pair()

            //removes the white player from the list of players
            pair.white = remainingPlayers.shift()!

            for (let blackPlayer of remainingPlayers) {
                pair.black = blackPlayer

                // if we found a legal pairng next we are counting the legal pairings
                // of all the remaining players
                if (this.isAcceptablePair(pair)) {
                    remainingPlayers.shift() //removes the balck player also

                    // count the number of legal pairings of all the remaining players
                    const res = countAcceptablePairs(
                        remainingPlayers,
                        ++legalPairings
                    )

                    legalPairings = Math.max(res, legalPairings)
                }

                // Stop the recursion if we reached the number of the maximum possible pairings
                if (maxPossiblePairings === legalPairings) {
                    return legalPairings
                }
            }
            return legalPairings
        }

        const numberOfLegalParings = countAcceptablePairs(allPlayers.slice())
        const upfloatersNeeded = allPlayers.length - numberOfLegalParings * 2

        console.debug('DubovSwissSystem - number of upfloaters needed', {
            scoreGroup: pairingBracket.getScores(),
            upfloatersNeeded: upfloatersNeeded,
        })
        return upfloatersNeeded
    }

    /**
     * Pairing for the first round
     *
     * The player s list calculated before is divided into two equal parts:
     * The players from the upper part of the list are placed on the left
     * and those from the lower part, on the right.
     */
    private pairFirstRound(players: Player[]): RoundPairing {
        const roundPairing: RoundPairing = []

        const middleIndex = Math.ceil(players.length / 2)

        const upperPart = players.splice(0, middleIndex)
        const lowerPart = players.splice(-middleIndex)

        //The first player from the left-hand list plays the first player
        // from the right-hand list the second plays the second, etc
        for (let table = 0; table < upperPart.length; table++) {
            const pair = new Pair()
            pair.table = table + 1

            // all even-numbered pairs have the same colours as the first pair,
            if (table % 2 === 0) {
                pair.white = upperPart[table]
                pair.black = lowerPart[table]
            }
            // whereas all odd-numbered pairs have the other colour
            else {
                pair.black = upperPart[table]
                pair.white = lowerPart[table]
            }
            roundPairing.push(pair)
        }

        return roundPairing
    }

    /**
     * Pairing-Allocated-Bye assignment
     * B.0
     * The pairing-allocated-bye is assigned to the player who:
     * a. has neither received a pairing-allocated-bye, nor scored a (forfeit)
     *    win in the previous rounds (see C.2)
     * b. allows a complete pairing of all the remaining players (see C.4)
     * c. has the lowest score
     * d. has played the highest number of games
     * e. occupies the lowest position in the initial ranking list (see A.2)
     */
    private pairingAllocatedByeAssignment(players: Player[]): Pair {
        const playerBye = players
            .slice()
            //a, has neither received a pairing-allocated-bye
            .filter(player => player.hasNoByeOrForfeitWin())
            .sort(
                (player1, player2) =>
                    //c,  has the lowest score
                    player2.scores() - player1.scores() ||
                    //d, has played the highest number of games
                    player1.getNumberOfPlayedGames() -
                        player2.getNumberOfPlayedGames() ||
                    //e, the lowest position in the initial ranking list
                    player2.startingRank - player1.startingRank
            )[0]

        const bye = new Pair()
        bye.allocatedBye = true
        bye.table = Math.round(players.length / 2)
        const dueColor: Color = this.colorUtils.dueColor(playerBye)
        if (dueColor == Color.WHITE) {
            bye.white = playerBye
        } else {
            bye.black = playerBye
        }
        return bye
    }

    /**
     * A player is said to be a maximum upfloater when he has already been upfloated
     * a maximum number of times (MaxT).
     */
    private isMaximumUpfloater(player: Player, maxT: number): boolean {
        return (
            Array.from(this.upfloaters.values())
                .flat()
                //FIXME filter by id maybe is better
                .filter(p => p === player).length === maxT
        )
    }

    /**
     * A pairing that complies with all the absolute pairing criteria
     * No pairing shall violate the following absolute criteria
     */
    private isAcceptablePair(pair: Pair): boolean {
        return (
            this.uniquePairingCriteria.evaluate(pair) &&
            this.singleAllocatedByeCriteria.evaluate(pair) &&
            this.colorPreferenceCriteria.evaluate(pair)
        )
    }

    /**
     * MaxT is a parameter whose value depends on the number of rounds in the tournament (Rnds),
     * and is computed with the following formula: MaxT = 2 + [Rnds/5]
     * where [Rnds/5] means Rnds divided by 5 and rounded downwards.
     */
    private calculateMaxT(round: number): number {
        return 2 + Math.floor(round / 5)
    }

    /**
     * Scoregroups
     *
     * A scoregroup is composed of all the players with the same score.
     **/
    private createScoreGroups(players: Array<Player>): Array<ScoreGroup> {
        const scoreGroupsMap = new HashMap<number, ScoreGroup>()

        players.forEach(player => {
            const scores = player.scores()
            const group = scoreGroupsMap.getOrDefault(
                scores,
                () => new ScoreGroup(scores)
            )
            group.addPlayer(player)
        })

        const scoreGroups = Array.from(scoreGroupsMap.values()).sort(
            (g1, g2) => g2.getScore() - g1.getScore()
        )

        return scoreGroups
    }

    /**
     * Average Rating of Opponents (ARO)
     * ARO is defined for each player who has played at least one game.
     * It is given by the sum of the ratings of the opponents the player
     * met over-the-board (i.e. only played games are used to compute ARO),
     * divided by the number of such opponents, and rounded to the nearest
     * integer number (the higher, if the division ends for 0.5).
     *
     * ARO is computed for each player after each round as a basis for the pairings of the next round.
     */
    private calculateAvarageRatingOfOpponents(player: Player): number {
        let playedGames = player.getPlayedGames()

        //If a player has yet to play a game, his ARO is zero.
        let aro = 0

        if (playedGames.length > 0) {
            let sumOfRatings = playedGames
                .map(game => game.opponent(player))
                .reduce((sum, opponent) => sum + (opponent?.fideRating || 0), 0)

            //rounded to the nearest integer number (the higher, if the division ends for 0.5)
            aro = Math.round(sumOfRatings / playedGames.length)
        }
        return aro
    }

    /**
     * To obtain the best possible pairing for a bracket,
     * comply as much as possible with the following criteria, given in descending priority:
     *
     * C.5	minimize the number of upfloaters.
     * C.6	minimize the score differences in the pairs involving upfloaters, i.e. maximize the lowest score among the upfloaters (and then the second lowest, and so on).
     * C.7	minimize the number of players who do not get their colour preference.
     * C.8	unless it is the last round, minimize the number of upfloaters who are maximum upfloaters (see A.7).
     * C.9	unless it is the last round, minimize the number of times a maximum upfloater is upfloated.
     * C.10	unless it is the last round, minimize the number of upfloaters who upfloated in the previous round.
     *
     * @param pairings
     * @param round
     * @param isLastRound
     * @returns
     */
    private chooseBestPairing(
        pairings: BracketPairing[],
        round: Round
    ): BracketPairing {
        //choose the best pairing for the bracket
        return pairings.slice().sort((b1, b2) => {
            const q1 = this.getQualityOfBracketPairing(b1, round)
            const q2 = this.getQualityOfBracketPairing(b2, round)
            return q1.compareTo(q2)
        })[0]
    }

    getQualityOfBracketPairing(
        bracketPairing: BracketPairing,
        round: Round
    ): PairingQuality {
        const bracket = bracketPairing.getBracket()
        const pairing = bracketPairing.getPairing()

        const quality = new PairingQuality()
        quality.acceptablePairs = bracketPairing.getNumberOfPairs()
        quality.upfloaters = bracket.getNumberOfUpfloaters() //C.5
        quality.totalUpfloaterScores = bracket.getUpfloaterScores() //C.6
        quality.wrongColors = this.countWrongColors(pairing) //C.7
        //unless it is the last round
        if (!round.isLastRound) {
            quality.maximumUpfloaters = this.countMaximumUpfloaters(
                bracket,
                round.roundNumber
            ) //C.8
            quality.maximumUpfloatersTimes =
                this.countMaximumUpfloatersTimes(bracket) //C.9
            quality.numberOfPreviousUpfloaters =
                this.countNumberOfPreviousUpfloaters(bracket, round.roundNumber) //C.10
        }
        return quality
    }

    /***********************************************************************/
    /** QUALITY CRITERIA METHODS                                          **/
    /***********************************************************************/

    // players who do not get their colour preference.
    countWrongColors(pairing: Pairing): number {
        let wrongColors = 0
        for (let pair of pairing) {
            if (this.colorUtils.dueColor(pair.white) !== Color.WHITE) {
                wrongColors++
            }
            if (this.colorUtils.dueColor(pair.black) !== Color.BLACK) {
                wrongColors++
            }
        }
        return wrongColors
    }

    // number of upfloaters who are maximum upfloaters
    countMaximumUpfloaters(bracket: Bracket, round: number): number {
        let maxT = this.calculateMaxT(round)
        return bracket
            .getUpfloaters()
            .slice()
            .filter(player => this.isMaximumUpfloater(player, maxT)).length
    }

    // the number of times a maximum upfloater is upfloated.
    countMaximumUpfloatersTimes(bracket: Bracket): number {
        return 0 //TODO implements
    }

    // the number of upfloaters who upfloated in the previous round.
    countNumberOfPreviousUpfloaters(bracket: Bracket, round: number): number {
        return 0 //TODO implements
    }
}

// //B.3The players of the bracket are divided in two subgroups:
// const players = bracket.getPlayers()

// //G1 This subgroup initially contains the players who have a colour preference for White
// let g1Players = players.slice()
//     .filter(p => this.colorUtils.dueColor(p) === Color.WHITE)

//     // B.5	Sort the players in (the possibly new) G1 in order of ascending ARO or,
//     // when AROs are equal, according to the initial ranking list - highest initial ranking first
//     // and so on.
//     .sort((p1, p2) =>
//         //order by ascending ARO
//         this.calculateAvarageRatingOfOpponents(p1) - this.calculateAvarageRatingOfOpponents(p2) ||

//         // highest initial ranking first
//         p2.startingRank - p1.startingRank)

// //G2 This subgroup initially contains the remaining players of the bracket.
// const g2Players = players.slice().filter(p => !g1Players.includes(p))
//     //Black seekers are sorted according to their initial ranking.
//     .sort((p1, p2) => p1.startingRank - p2.startingRank)
