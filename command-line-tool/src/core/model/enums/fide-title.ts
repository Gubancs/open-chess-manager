export enum FideTitle {
    WCM = 'WCM',
    WFM = 'WFM',
    CM = 'CM',
    WIM = 'WIM',
    FM = 'FM',
    WGM = 'WGM',
    IM = 'IM',
    GM = 'GM',
}

export function getFideTitileByRating(rating?: number): FideTitle | undefined {
    if (rating) {
        if (rating >= 2500) {
            return FideTitle.GM
        } else if (rating >= 2400) {
            return FideTitle.IM
        } else if (rating >= 2300) {
            return FideTitle.FM
        } else if (rating >= 2200) {
            return FideTitle.CM
        }
    }
}

export function getWomanFideTitileByRating(
    rating?: number
): FideTitle | undefined {
    if (rating) {
        if (rating >= 2400) {
            return FideTitle.WGM
        } else if (rating >= 2200) {
            return FideTitle.WIM
        } else if (rating >= 2100) {
            return FideTitle.WFM
        } else if (rating >= 2000) {
            return FideTitle.WCM
        }
    }
}
