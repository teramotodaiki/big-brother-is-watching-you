#!/bin/bash

# 画像の保存先パスを生成
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
outDir="$DIR/out/$(date +%Y%m%d)"
imgPath="$outDir/$(date +%H%M%S).png"

# ディレクトリが存在しなければ作成
mkdir -p $outDir

# スクリーンショットを撮影
screencapture -x -D 2 $imgPath

# Node.jsのスクリプトを実行
$HOME/.nvm/versions/node/v18.17.1/bin/node $DIR/index.js $imgPath
