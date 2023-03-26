# GitHub Action Composer

Small utility for creating GH actions with TypeScript

## Setup

```shell
# In a code project:
yarn add @caldwell619/github-action-composer

# As a one-off CLI:
npx @caldwell619/github-action-composer --ps example/source-images/ --po example/out/
```

## Options

These options control the behavior, and can be given either by the CLI or as arguments in the code file.

| Argument        | Alias | Required?          | Description                                                                                                        |
| --------------- | ----- | ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `pathToSource`  | `ps`  | :white_check_mark: | Relative to the **execution location**, the path to the source directory for the images to be converted            |
| `pathToOutput`  | `po`  | :white_check_mark: | Relative to the **execution location**, the path to the output directory for the converted image output            |
| `parallelLimit` | `pl`  | :x:                | If you'd like for many images to be processed at once, provide the limit                                           |
| `quality`       | `q`   | :x:                | Scale of [1-100], the percentage quality you want the output to be. `100`, would be the same quality as the source |
| `logLevel`      | `ll`  | :x:                | Either verbose, or quiet logs                                                                                      |

## CLI

The aliases can be swapped with the longer version to keep this short.

The following writes the out with an image quality of 75%, doing no more than 5 at once.

```shell
npx @caldwell619/bulk-webp-converter \
  --ps example/source-images/ \
  --po example/out/ \
  --q 75 \
  --pl 5
```

## Code

It can be imported if you'd rather create a file and run it. An example use case of this would be bulk processing on a server, or if you need this regularly on your local and throw up a folder to move photos in and out of.

> :warning: **Note**
> Keep in mind that the aliases cannot be used with code. With TypeScript, this isn't an issue but for JS, they must match the first column in the options table

```js
import { bulkWebPConvert } from '@caldwell619/bulk-webp-converter'

// relative from execution - this is called from the root
const pathToSource = 'example/source-images'
const pathToOutput = 'example/out'

bulkWebPConvert({ pathToSource, pathToOutput, quality: 100, parallelLimit: 1 })
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })
```
