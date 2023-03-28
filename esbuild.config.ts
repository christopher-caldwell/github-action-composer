import esbuild from 'esbuild'

const build = async () => {
  try {
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      outdir: 'dist',
      bundle: false,
      minify: true,
      platform: 'node',
      target: 'node16',
      format: 'cjs',
    })
    process.exit()
  } catch (e) {
    process.exit(1)
  }
}

build()
