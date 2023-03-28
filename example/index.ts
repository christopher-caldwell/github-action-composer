import { ActionComposer } from '@caldwell619/github-action-composer'

const Composer = new ActionComposer('Code Quality')

Composer.addTrigger('pull_request', { branches: ['staging'] })
const job = Composer.addJob('code_quality', { 'runs-on': 'ubuntu-latest', steps: [] })
Composer.addStep(job, { uses: 'actions/checkout@v3', with: { 'fetch-depth': 0 } })
Composer.addStep(job, { uses: 'actions/setup-node@v3', with: { 'node-version': 16, cache: 'yarn' } })
Composer.addStep(job, {
  name: 'Authenticate with private NPM package',
  run: 'echo "//registry.npmjs.org/:_authToken=${{ secrets.NPM_TOKEN }}" > ~/.npmrc',
})
Composer.addStep(job, {
  name: 'Install Packages',
  run: 'yarn --prefer-offline --frozen-lockfile',
})
Composer.addStep(job, {
  run: 'npx nx format:check',
})
Composer.addStep(job, {
  run: 'npx nx affected --target=lint --parallel=3',
})
Composer.addStep(job, {
  run: 'npx nx affected --target=type-check --parallel=3',
})
Composer.addStep(job, {
  run: 'npx nx affected --target=test --parallel=3 --configuration=ci',
})
Composer.compileAction('./.github/workflows/ci_output.yml')
