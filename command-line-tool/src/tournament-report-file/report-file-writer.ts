import fs from 'fs-extra'
import { Tournament } from '../core/model/tournament.js'
import { ReportFileFormat } from './report-file-format.js'
import { TRF06Serializer } from './serializer/trf06-serializer.js'
import { TRF16Serializer } from './serializer/trf16-serializer.js'

export class ReportFileWriter {
    writeReportToFile(
        file: string,
        tournament: Tournament,
        econding: BufferEncoding = 'utf8',
        format = ReportFileFormat.TRF16
    ) {
        let content = ''
        if (format === ReportFileFormat.TRF16) {
            content = new TRF16Serializer().serialize(tournament)
        } else if (format === ReportFileFormat.TRF06) {
            content = new TRF06Serializer().serialize(tournament)
        } else {
            throw Error(
                'Tournament report file format ' +
                    format +
                    ' is not implemented yet.'
            )
        }

        fs.ensureFileSync(file)
        fs.writeFileSync(file, content, { encoding: econding })
    }
}
