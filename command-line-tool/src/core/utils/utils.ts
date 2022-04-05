import { GameResult } from '../model/enums/game-result.js'

export function negateGameResult(result: GameResult) {
    if (result === GameResult.FORFEIT_LOSS) {
        return GameResult.FORFEIT_WIN
    } else if (result === GameResult.FORFEIT_WIN) {
        return GameResult.FORFEIT_LOSS
    }

    if (result === GameResult.FRIENDLY_WIN) {
        return GameResult.FRIENDLY_LOSS
    } else if (result === GameResult.FRIENDLY_LOSS) {
        return GameResult.FRIENDLY_WIN
    }

    if (result === GameResult.WIN) {
        return GameResult.LOSS
    } else if (result === GameResult.LOSS) {
        return GameResult.WIN
    }
    return result
}

export function valueOfGameResult(result: GameResult): number {
    switch (result) {
        case GameResult.DRAW:
            return 0.5
        case GameResult.WIN:
            return 1
        case GameResult.LOSS:
            return 0
        case GameResult.FRIENDLY_DRAW:
            return 0.5
        case GameResult.FRIENDLY_WIN:
            return 1
        case GameResult.FRIENDLY_LOSS:
            return 0

        case GameResult.FORFEIT_WIN:
            return 1
        case GameResult.FORFEIT_LOSS:
            return 0

        case GameResult.HALF_POINT_BYE:
            return 0.5
        case GameResult.FULL_POINT_BYE:
            return 1
        case GameResult.PAIRING_ALLOCATED_BYE:
            return 1
        case GameResult.ZERO_POINT_BYE:
            return 0
    }
}
