import { resolve } from 'path'
import { writeFileSync } from 'fs'
import { stringify } from 'yaml'
import { WalkBuilder, WalkNode } from 'walkjs'

import type { ActionTrigger, ActionTriggerConfig, Job, JobStep, Action } from './types'
// TODO: Env args
export class ActionComposer {
  constructor(
    public name: string,
    public triggers: ActionTriggerConfig = {},
    public jobs: Action['jobs'] = {},
    public writePath?: string,
    public isTemplateValid?: boolean,
    public logger: Console = console,
    public action?: Action
  ) {}

  /**
   * @param relativePath The **relative** path from execution to the output. Will end with the name out the output file. Example: `./.github/workflows/ci.yml`
   * @param usePathDirectly Set this if you **do not** want the path resolved for you. Meaning you will be responsible for the path given directly to write.
   */
  setWritePath(relativePath: string, usePathDirectly?: boolean) {
    const configFileName = usePathDirectly ? relativePath : resolve(process.cwd(), relativePath)
    this.writePath = configFileName
  }

  addTrigger(trigger: ActionTrigger, configuration: ActionTriggerConfig[ActionTrigger]) {
    this.triggers[trigger] = configuration
  }

  addStep<TWith extends Record<string, unknown>>(jobName: string, step: JobStep<TWith>) {
    const targetJob = this.jobs[jobName]
    if (!targetJob) throw new Error('Cannot create a step without the corresponding job ')
    targetJob.steps.push(step)
  }

  addJob(name: string, job: Job) {
    this.jobs[name] = job
    return name
  }

  composeAction() {
    this.action = {
      name: this.name,
      on: this.triggers,
      jobs: this.jobs,
    }
    return this.action
  }

  validateConfig() {
    this.isTemplateValid = true
    const ensureValuesAreNotUndefined = (node: WalkNode) => {
      if (node.val === undefined) {
        this.logger.error(node.getPath(), 'is undefined.\nCannot finish writing the yml file with undefined variables.')
        this.isTemplateValid = false
      }
    }

    const walker = new WalkBuilder().withSimpleCallback(ensureValuesAreNotUndefined)

    if (!this.action) throw new Error('You have to compose the action before validation')
    walker.walk(this.action)
    return this.isTemplateValid
  }

  writeActionToYmlFile() {
    if (!this.writePath) throw new Error('You must set the `writePath` before writing.')
    if (!this.action) throw new Error('You must compose the the action before writing.')
    writeFileSync(this.writePath, stringify(this.action))
  }

  compileAction(relativePath: string, usePathDirectly?: boolean) {
    this.setWritePath(relativePath, usePathDirectly)
    this.composeAction()
    this.validateConfig()
    this.writeActionToYmlFile()
  }
}

export * from './types'
