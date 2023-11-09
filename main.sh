#!/bin/bash

# 画像の保存先パスを生成
imgPath="$HOME/github/big-brother-is-watching-you/img/$(date +%Y%m%d%H%M%S).png"

# スクリーンショットを撮影
screencapture -x -D 2 $imgPath

# Node.jsのスクリプトを実行
$HOME/.nvm/versions/node/v18.17.1/bin/node ~/github/big-brother-is-watching-you/index.js $imgPath
