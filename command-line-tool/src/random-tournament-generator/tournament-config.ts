import { PairingSystem } from '../core/model/enums/pairing-system.js'
import { ReportFileFormat } from '../tournament-report-file/report-file-format.js'

export interface RTGConfig {
    rounds: number
    system: PairingSystem
    players: number
    highestRating: number
    lowestRating: number
    encoding: BufferEncoding
    format: ReportFileFormat
}
export class DefaultRTGConfig implements RTGConfig {
    rounds: number = 9
    players: number = 100
    encoding: BufferEncoding = 'utf-8'
    highestRating: number = 2550
    lowestRating: number = 1000
    format: ReportFileFormat = ReportFileFormat.TRF16
    system: PairingSystem = PairingSystem.SWISS
}
