import { getAllCountryDetails } from 'world-countries-capitals'
import {
    getFideTitileByRating,
    getWomanFideTitileByRating,
} from '../../core/model/enums/fide-title.js'
import { Gender } from '../../core/model/enums/gender.js'
import { Player } from '../../core/model/player.js'
import { randomItem } from '../../utils.js'
import { RandomNameGenerator } from './dummy-name-generator.js'

export class RandomPlayerGenerator {
    randomNames = new RandomNameGenerator()

    constructor(private minRating: number, private maxRating: number) {}

    dummyPlayer(): Player {
        const player = new Player()

        //Country
        player.country = randomItem(getAllCountryDetails())

        //Gender
        player.gender = Math.random() < 0.8 ? Gender.MALE : Gender.FEMALE

        //First name
        if (player.gender === Gender.MALE) {
            player.firstName = this.randomNames.maleFirstName()
        } else {
            player.firstName = this.randomNames.femaleFirstName()
        }

        //Lastname
        player.lastName = this.randomNames.commonSureName()

        //FIDE rating
        if (Math.random() < 0.8) {
            player.fideRating =
                Math.floor(
                    Math.random() * (this.maxRating - this.minRating + 1)
                ) + this.minRating
            //FIDE id
            player.fideNumber = Math.floor(
                Math.random() * (1999999 - 10000 + 1) + 10000
            )
        }

        //Year of birth
        const maxDate = new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 10
        const minDate = maxDate - 1000 * 60 * 60 * 24 * 365 * 100
        player.birthDate = new Date(
            Math.floor(Math.random() * (maxDate - minDate + 1)) + minDate
        )

        //FIDE title
        if (Math.random() < 0.8) {
            if (player.gender === Gender.MALE) {
                player.fideTitle = getFideTitileByRating(player.fideRating)
            } else if (player.gender === Gender.FEMALE) {
                player.fideTitle = getWomanFideTitileByRating(player.fideRating)
            }
        }
        return player
    }
}
