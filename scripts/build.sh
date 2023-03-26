#!/bin/sh

Red="\033[0;31m"    # Red
Green="\033[0;32m"  # Green
BICyan="\033[1;96m" # Bold Cyan
Color_Off="\033[0m" # Text Reset

rm -rf dist

printf "\n\n$BICyan$(echo Linting)$Color_Off"
printf "\n\n"

yarn lint

if [ $? != 0 ]; then
  printf "\n\n$Red$(echo Linting failed.)$Color_Off"
  exit 1
fi

printf "\n\n$BICyan$(echo Type checking)$Color_Off"
printf "\n\n"

yarn tsc

if [ $? != 0 ]; then
  printf "\n\n$Red$(echo Type check failed.)$Color_Off"
  exit 1
fi

printf "\n\n$BICyan$(echo Building artifact)$Color_Off"
printf "\n\n"

yarn ts-node esbuild.config.ts

if [ $? != 0 ]; then
  printf "\n\n$Red$(echo Build failed.)$Color_Off"
  exit 1
fi

cp bin/bin.js dist/
