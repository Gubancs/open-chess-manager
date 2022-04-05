#!/usr/bin/env node

import chalk from 'chalk'
import clear from 'clear'
import { Command } from 'commander'
import figlet from 'figlet'
import { DubovSwissSystem } from './pairing-engine/systems/dubov-pairing-system.js'
import { RandomTournamentGenerator } from './random-tournament-generator/random-tournament-generator.js'
import {
    DefaultRTGConfig,
    RTGConfig,
} from './random-tournament-generator/tournament-config.js'
import { ReportFileWriter } from './tournament-report-file/report-file-writer.js'
import { checkNumberRange, parseInteger } from './utils.js'

clear()

const info = chalk.green
const error = chalk.bold.red

console.log(info(figlet.textSync('OCM-cli')))
console.log(
    info(
        'Welcome to the command line interface of the Open Chess Manager software.'
    )
)

const program = new Command()
program
    .name('@ocm/cli')
    .alias('osmcli')
    .description(
        'The OCM-cli is a free command line tool which has two sub command \n' +
            '1. generate - to generating random simulated toruments\n' +
            '2. check - validates a tournament file, supported file formats: (TRF06, TRF16)'
    )
    .option('-d, --debug', 'enable debug level logging')
    .version('1.0.0', '-v, --version', 'print the current version')
    .configureOutput({
        writeOut: str => console.log(str),
        writeErr: str => console.log(error(`${str}`)),
    })

const defaultRTGConfig = new DefaultRTGConfig()

program
    .command('generate <outputFile>')
    .alias('rtg')
    .description('RTG - Random Tournament Generator')
    .option(
        '-f, --format <output-format>',
        'output format of the generated file',
        defaultRTGConfig.format.toString()
    )
    .option(
        '-r, --rounds <rounds>',
        'number of the round to be generated (min: 1, max: 30)',
        defaultRTGConfig.rounds.toString()
    )
    .option(
        '-p, --players <players>',
        'number of players (min: 0, max: 9999)',
        defaultRTGConfig.players.toString()
    )
    .option(
        '-s, --system <system>',
        'Pairing system of the generated tournament',
        defaultRTGConfig.system.toString()
    )
    .option(
        '-e, --encoding <encoding>',
        'Character encoding of the tournament report file',
        defaultRTGConfig.encoding.toString()
    )
    .option(
        '-t, --highestRating <highest-rating>',
        'highest possible rating of a player in the tournament (min: 0, max: 3000)',
        defaultRTGConfig.highestRating.toString()
    )
    .option(
        '-l, --lowestRating <lowest-rating>',
        'lowest possible rating of a player in the tournament (min: 0, max: 3000)',
        defaultRTGConfig.lowestRating.toString()
    )
    .option(
        '-c, --config <config-file>',
        'configuration file for the random-tournament-generator'
    )
    .action((outputFile: string, options: RTGConfig) => {
        try {
            const rtg = new RandomTournamentGenerator()

            checkNumberRange(options, 'lowestRating', 'highestRating')

            let tournament = rtg.generate(
                parseInteger(options, 'rounds', 1, 30),
                parseInteger(options, 'players', 0, 9999),
                parseInteger(options, 'lowestRating', 0, 3000),
                parseInteger(options, 'highestRating', 0, 3000),
                new DubovSwissSystem()
            )

            const trfWriter = new ReportFileWriter()
            trfWriter.writeReportToFile(
                outputFile,
                tournament,
                options.encoding,
                options.format
            )
        } catch (cause) {
            console.log(error(cause))
        }
    })

program
    .command('check <inputFile>')
    .alias('fpc')
    .description('FPC - Free Pairings Checker')
    .option('-g, --rounds <rounds>', 'number of the round to be checked', 'all')
    .action((inputFile, options) => {
        console.log('checking input tournament file...', inputFile, options)
    })

program.showHelpAfterError('(add --help for additional information)')
program.parse()
