import { Color } from '../../core/model/enums/color.js'
import { Player } from '../../core/model/player.js'
import { ColorDifference } from '../model/color-difference.js'

export class ColorUtils {
    /**
     * The Color difference of a player is the number of games
     * played with white minus the number of games played with black by this player.
     */
    colorDifference(player: Player): ColorDifference {
        return player.getNumberOfWhiteGames() - player.getNumberOfBlackGames()
    }

    /**
     * The Color preference (also called: due Color) is the Color that
     * a player should ideally receive for the next game.
     */
    dueColor(player: Player): Color {
        let dueColor = Color.BLACK

        const colorDifference: ColorDifference = this.colorDifference(player)
        //A. An absolute Color preference occurs when a player's
        //Color difference is greater than +1 or less than -1
        if (colorDifference > 1) {
            dueColor = Color.BLACK
        } else if (colorDifference < -1) {
            dueColor = Color.WHITE
        }

        //B. A strong Color preference occurs when a player's
        //Color difference is +1 (preference for black) or -1 (preference for white).
        else if (colorDifference === 1) {
            dueColor = Color.BLACK
        } else if (colorDifference === -1) {
            dueColor = Color.WHITE
        }
        //C. A mild Color preference occurs when a player's Color difference is zero,
        // the preference being to alternate the Color with respect to the previous game he played.
        else if (
            this.isMildColorPreference(colorDifference) &&
            player.games.length > 0
        ) {
            dueColor =
                player.getLasGame().color(player) === Color.WHITE
                    ? Color.BLACK
                    : Color.WHITE
        }
        //D. Players who did not play any games are considered to have a mild Color preference for black.
        else if (
            this.isMildColorPreference(colorDifference) &&
            player.games.length === 0
        ) {
            dueColor = Color.BLACK
        }
        return dueColor
    }

    /**
     * An absolute colour preference occurs when a player's colour
     * difference is greater than +1 or less than -1
     */
    isAbsoluteColorPreference(colorDifference: ColorDifference): boolean {
        return colorDifference > 1 || colorDifference < -1
    }

    /**
     * An absolute colour preference occurs when a player's colour
     * difference is greater than +1 or less than -1
     */
    hasAbsoluteColorPreference(player: Player): boolean {
        return this.isAbsoluteColorPreference(this.colorDifference(player))
    }

    /**
     * A strong colour preference occurs when a player's colour difference is +1 or -1
     */
    isStrongColorPreference(colorDifference: ColorDifference): boolean {
        return colorDifference === 1 || colorDifference === -1
    }

    /**
     * A mild colour preference occurs when a player's colour difference is zero
     */
    isMildColorPreference(colorDifference: ColorDifference): boolean {
        return colorDifference === 0
    }

    /**
     * Returns the opposite color of the given color
     * @param color
     * @returns
     */
    oppositeColor(color: Color): Color {
        return Color.WHITE === color ? Color.BLACK : Color.BLACK
    }
}
