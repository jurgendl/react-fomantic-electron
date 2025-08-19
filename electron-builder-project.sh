#!/bin/bash
printf "\033c"
node clean.cjs
yarn build
npx electron-builder
read -p "..."