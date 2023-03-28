import { Command, Option, runExit } from 'clipanion'

runExit(
  class ActionComposeCommand extends Command {
    name = Option.String()

    async execute() {
      this.context.stdout.write(`Hello ${this.name}!\n`)
    }
  }
)
