import { resolve } from 'path'
import { writeFileSync } from 'fs'
import { stringify } from 'yaml'
import { WalkBuilder, WalkNode } from 'walkjs'

import { config } from './app.yaml'

// This is designed to be ran with a `cwd` via Nx. This means that cwd will be scheduler, not the root.
const configFileName = resolve(process.cwd(), 'app.yaml')

const ensureValuesAreNotUndefined = (node: WalkNode) => {
  if (node.val === undefined) {
    logger.error(
      node.getPath(),
      'is undefined.\nCannot finish writing the app.yaml file with undefined environment variables.'
    )
    process.exit(1)
  }
}

const walker = new WalkBuilder().withSimpleCallback(ensureValuesAreNotUndefined)

// Make sure nothing that is an environment variable is undefined
walker.walk(config)

writeFileSync(configFileName, stringify(config))
