declare module 'world-countries-capitals' {


    export interface Country {
        country: string,
        capital: string,
        currency: string,
        native_language: string[],
        famous_for: string,
        phone_code: string,
        flag: string,
        drive_direction: string,
        alcohol_prohibition: string,
        area: {
            km2: number,
            mi2: number,
        },
        continent: string,
        iso: {
            numeric: string,
            alpha_2: string,
            alpha_3: string,
        },
        tld: string,
        constitutional_form: string,
        language_codes: string[],
        is_landlocked: boolean
    }

    export function getCountriesByLandLock(isLandLocked: boolean): Country[]
    export function getCountriesByConstitutionalForm(form: string): Country[]
    export function getCountriesByTLD(tld: string): Country
    export function getCountryDetailsByISO(isoType: string, isoValue: string): Country
    export function getCountriesByContinent(code: string): Country[]
    export function getCountriesByAlcoholProhibition(type: string): Country[]
    export function getCountriesByDriveDirection(direction: string): Country[]
    export function getCountriesByFamousFor(famousThing: string): Country[]
    export function getCountriesByLanguage(language: string): Country[]
    export function getCountryDetailsByCapital(capital: string): Country
    export function getCountryDetailsByName(name: string): Country
    export function getNRandomCountriesData(amount: number): Country[]
    export function getAllCountryDetails(): Country[]
    export function getAllCountries(): string[]
    export function getRandomCountry(): string
}