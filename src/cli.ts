import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { BulkConvertArgs, bulkWebPConvert } from './index'

const qualityChoices = new Array(100).fill(null).map((_, index) => index + 1)

/** Handles the parsing of cmd line args, sets the config accordingly */
export const handleCli = async () => {
  const { parallelLimit, pathToSource, pathToOutput, quality, logLevel } = await yargs(hideBin(process.argv))
    .options('parallelLimit', {
      type: 'number',
      default: 1,
      describe: 'Limit for images processes in parallel instead of sequentially',
    })
    .options('pathToSource', {
      type: 'string',
      describe: 'Relative path to the images directory to convert',
    })
    .options('pathToOutput', {
      type: 'string',
      describe: 'Relative path to the output directory that will store converted images',
    })
    .options('quality', {
      type: 'number',
      default: 100,
      describe: 'The quality of the output WebP image [1-100]',
      choices: qualityChoices,
    })
    .options('logLevel', {
      type: 'string',
      default: '-quiet',
      describe: 'The log level of the conversion',
      choices: ['-v', '-quiet'],
    })
    .demandOption('pathToOutput')
    .demandOption('pathToSource')
    .help()
    .version()
    .alias('version', 'v')
    .alias('quality', 'q')
    .alias('logLevel', 'll')
    .alias('parallelLimit', 'pl')
    .alias('pathToSource', 'ps')
    .alias('pathToOutput', 'po')
    .strict().argv

  await bulkWebPConvert({
    pathToSource,
    pathToOutput,
    quality,
    parallelLimit,
    logLevel: logLevel as BulkConvertArgs['logLevel'],
  })
}

handleCli()
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })
