/**
 * Options:
 *
 * Class, methods to add step, configure shit, etc.
 *
 * Compose: plug steps into a composer via an array like `createBuildSteps([])`
 *
 * Need to have some optional, baked in things like node caching, node matrix, setting env vars. Would be cool to make like a white list array of values to plug into the template.
 *
 * Additionally could do provide array of `name`-`value`-`source` (env, secrets, vars) and generate NAME: ${vars.NAME}
 */

export type ActionTrigger = 'pull_request'
export type NodeVersion = '16.x'

export type ActionTriggerConfig = Partial<
  Record<
    ActionTrigger,
    {
      branches?: string[]
    }
  >
>

export interface Job {
  'runs-on': string
  environment?: string
  steps: JobStep[]
  strategy?: {
    matrix: {
      'node-version': NodeVersion[]
    }
  }
}
export interface JobStep<TWith = Record<string, unknown>> {
  id?: string
  name?: string
  uses?: string
  run?: string | string[]
  with?: TWith
}
export interface Action {
  name: string
  on: ActionTriggerConfig
  jobs: Record<string, Job>
}
